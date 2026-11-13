import "server-only";
import { AuthRateCounter } from "@/modules/auth/models";
import { ApiError } from "@/server/http/errors";
import { hashToken } from "./tokens";

type LimitedAction = "signup" | "login" | "forgot-password" | "reset-password";

export async function enforceRateLimit(action: LimitedAction, identity: string) {
  // Each account (or reset token) has its own bucket across application instances.
  // Never trust arbitrary forwarded IP headers or store raw emails/reset tokens.
  const window = Math.floor(Date.now() / 900_000);
  const subject = action === "reset-password" ? identity : identity.toLowerCase().trim();
  const key = `${action}:${hashToken(`rate:${action}`, subject)}:${window}`;
  const limit = action === "forgot-password" ? 3 : 10;
  let counter;
  try {
    counter = await AuthRateCounter.findOneAndUpdate({ key }, {
      $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((window + 2) * 900_000) },
    }, { upsert: true, returnDocument: "after" }).lean();
  } catch (error) {
    if (!(error && typeof error === "object" && "code" in error && error.code === 11000)) throw error;
    counter = await AuthRateCounter.findOneAndUpdate({ key }, { $inc: { count: 1 } }, { returnDocument: "after" }).lean();
  }
  if (!counter || counter.count > limit) throw new ApiError(429, "RATE_LIMITED", "Too many attempts. Please try again in 15 minutes.");
}
