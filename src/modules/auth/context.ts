import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Types } from "mongoose";
import { authDatabase } from "./database";
import { AuthSession, User } from "./models";
import { hashToken, validToken } from "@/server/security/tokens";
import { ApiError } from "@/server/http/errors";

export const SESSION_COOKIE = "mmm_session";

export async function getAuthContext() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !validToken(token)) return null;
  const db = await authDatabase();
  const session = await AuthSession.findOne({ tokenHash: hashToken("session", token), expiresAt: { $gt: new Date() } }).lean();
  if (!session) return null;
  const user = await User.findById(session.userId).lean();
  if (!user || user.authVersion !== session.authVersion) return null;
  // Read the approved membership projection without introducing wedding writes.
  const membership = await db.connection.collection("wedding_memberships").findOne<{ weddingId: Types.ObjectId; role: "ADMIN" | "MANAGER" }>({ userId: user._id });
  const wedding = membership ? await db.connection.collection("weddings").findOne<{ _id: Types.ObjectId; brideName: string; groomName: string; weddingDate: string }>({ _id: membership.weddingId }, { projection: { brideName: 1, groomName: 1, weddingDate: 1 } }) : null;
  return {
    user: { id: user._id.toString(), name: user.name, email: user.email },
    membership: membership && wedding ? { role: membership.role } : null,
    wedding: wedding ? { id: wedding._id.toString(), brideName: wedding.brideName, groomName: wedding.groomName, weddingDate: wedding.weddingDate } : null,
  };
}

export async function requireAuth() {
  const context = await getAuthContext();
  if (!context) throw new ApiError(401, "UNAUTHORIZED", "Sign in to continue.");
  return context;
}

export async function requirePageAuth() {
  const context = await getAuthContext();
  if (!context) redirect("/login");
  return context;
}

export async function requireSignedOut() {
  const context = await getAuthContext();
  if (context) redirect(context.wedding ? "/app" : "/onboarding/create-wedding");
}
