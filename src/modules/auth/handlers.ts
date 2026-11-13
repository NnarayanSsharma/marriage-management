import "server-only";
import { cookies } from "next/headers";
import type { z } from "zod";
import { ApiError, errorResponse } from "@/server/http/errors";
import { assertSameOrigin, readJson } from "@/server/security/request";
import { enforceRateLimit } from "@/server/security/rate-limit";
import { hashToken } from "@/server/security/tokens";
import { AuthSession } from "./models";
import { authDatabase } from "./database";
import { getAuthPolicy } from "./policy";
import { SESSION_COOKIE, requireAuth, getAuthContext } from "./context";
import { forgotSchema, loginSchema, resetSchema, signupSchema } from "./validation";
import { forgotPassword, login, resetPassword, signup } from "./service";

const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };
function parse<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (result.success) return result.data;
  const details: Record<string, string> = {};
  for (const issue of result.error.issues) details[String(issue.path[0] ?? "body")] ??= issue.message;
  throw new ApiError(400, "VALIDATION_ERROR", "Check the highlighted fields.", details);
}
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function authMutation(action: "signup" | "login" | "logout" | "forgot-password" | "reset-password", request: Request) {
  try {
    assertSameOrigin(request);
    if ((action === "signup" || action === "login") && await getAuthContext()) {
      throw new ApiError(409, "ALREADY_AUTHENTICATED", "You are already signed in. Sign out before using another account.");
    }
    const input = action === "logout" ? null : await readJson(request);
    await authDatabase();
    // Logout requires authentication and origin checks, but shares no abuse bucket.
    if (action === "logout") {
      await requireAuth();
      const jar = await cookies();
      await AuthSession.deleteOne({ tokenHash: hashToken("session", jar.get(SESSION_COOKIE)!.value) });
      jar.set(SESSION_COOKIE, "", { ...cookieOptions, expires: new Date(0), maxAge: 0 });
      return json({ success: true });
    }
    if (action === "forgot-password") {
      const data = parse(forgotSchema, input);
      await enforceRateLimit(action, data.email);
      await forgotPassword(data.email);
      return json({ success: true });
    }
    if (action === "reset-password") {
      const data = parse(resetSchema(getAuthPolicy().passwordMin), input);
      await enforceRateLimit(action, data.token);
      await resetPassword(data.token, data.password);
      (await cookies()).set(SESSION_COOKIE, "", { ...cookieOptions, expires: new Date(0), maxAge: 0 });
      return json({ success: true });
    }
    let result: Awaited<ReturnType<typeof signup>>;
    if (action === "signup") {
      const data = parse(signupSchema(getAuthPolicy().passwordMin), input);
      await enforceRateLimit(action, data.email);
      result = await signup(data);
    } else {
      const data = parse(loginSchema, input);
      await enforceRateLimit(action, data.email);
      result = await login(data);
    }
    const jar = await cookies();
    const old = jar.get(SESSION_COOKIE)?.value;
    if (old) await AuthSession.deleteOne({ tokenHash: hashToken("session", old) });
    jar.set(SESSION_COOKIE, result.token, { ...cookieOptions, expires: result.expiresAt });
    return json({ data: result.data }, action === "signup" ? 201 : 200);
  } catch (error) { return errorResponse(error); }
}

export async function currentUser() {
  try { return json({ data: await requireAuth() }); }
  catch (error) { return errorResponse(error); }
}
