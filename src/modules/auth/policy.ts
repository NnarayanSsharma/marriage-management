import "server-only";
import { z } from "zod";

// These settings are deliberately explicit until the product policy is confirmed.
const policySchema = z.object({
  AUTH_PASSWORD_MIN_LENGTH: z.coerce.number().int().min(8).max(64),
  AUTH_SESSION_DAYS: z.coerce.number().int().min(1).max(30),
  AUTH_RESET_MINUTES: z.coerce.number().int().min(5).max(60),
  AUTH_RESET_REVOKE_SESSIONS: z.enum(["true", "false"]),
});
export function getAuthPolicy() {
  const result = policySchema.safeParse({
    AUTH_PASSWORD_MIN_LENGTH: process.env.AUTH_PASSWORD_MIN_LENGTH,
    AUTH_SESSION_DAYS: process.env.AUTH_SESSION_DAYS,
    AUTH_RESET_MINUTES: process.env.AUTH_RESET_MINUTES,
    AUTH_RESET_REVOKE_SESSIONS: process.env.AUTH_RESET_REVOKE_SESSIONS,
  });
  if (!result.success) throw new Error("Authentication policy configuration is required.");
  return { passwordMin: result.data.AUTH_PASSWORD_MIN_LENGTH, passwordMax: 128, sessionDays: result.data.AUTH_SESSION_DAYS, resetMinutes: result.data.AUTH_RESET_MINUTES, revokeOnReset: result.data.AUTH_RESET_REVOKE_SESSIONS === "true" };
}
