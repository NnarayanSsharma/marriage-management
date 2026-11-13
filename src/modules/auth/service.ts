import "server-only";
import { Types } from "mongoose";
import { authDatabase } from "./database";
import { AuthSession, PasswordReset, User } from "./models";
import { getAuthPolicy } from "./policy";
import { ApiError } from "@/server/http/errors";
import { hashPassword, verifyPassword } from "@/server/security/passwords";
import { hashToken, newToken } from "@/server/security/tokens";
import { sendPasswordReset } from "@/server/email/password-reset";
import { getEmailEnv } from "@/server/config/env";

function sessionValues(userId: Types.ObjectId, authVersion: number) {
  const token = newToken();
  const expiresAt = new Date(Date.now() + getAuthPolicy().sessionDays * 86_400_000);
  return { token, expiresAt, record: { userId, authVersion, tokenHash: hashToken("session", token), expiresAt } };
}

export async function signup(input: { name: string; email: string; password: string }) {
  const db = await authDatabase();
  const passwordHash = await hashPassword(input.password);
  const id = new Types.ObjectId();
  const session = sessionValues(id, 0);
  try {
    await db.connection.transaction(async transaction => {
      await User.create([{ _id: id, name: input.name, email: input.email, emailNormalized: input.email.toLowerCase(), passwordHash }], { session: transaction });
      await AuthSession.create([session.record], { session: transaction });
    });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) throw new ApiError(409, "EMAIL_ALREADY_EXISTS", "An account with this email already exists. Sign in or reset your password.");
    throw error;
  }
  return { token: session.token, expiresAt: session.expiresAt, data: { user: { id: id.toString(), name: input.name, email: input.email }, hasWedding: false } };
}

export async function login(input: { email: string; password: string }) {
  const db = await authDatabase();
  const user = await User.findOne({ emailNormalized: input.email.toLowerCase() }).select("+passwordHash").lean();
  if (!await verifyPassword(user?.passwordHash, input.password) || !user) throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password.");
  const session = sessionValues(user._id, user.authVersion);
  // Password resets update this same user document. An in-flight old-password
  // login cannot create a valid session after a reset commits.
  await db.connection.transaction(async transaction => {
    const unchanged = await User.updateOne({ _id: user._id, passwordHash: user.passwordHash, authVersion: user.authVersion }, { $inc: { authVersion: 0 } }, { session: transaction });
    if (!unchanged.matchedCount) throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password.");
    await AuthSession.create([session.record], { session: transaction });
  });
  const membership = await db.connection.collection("wedding_memberships").findOne({ userId: user._id });
  const wedding = membership && await db.connection.collection("weddings").findOne({ _id: membership.weddingId }, { projection: { _id: 1 } });
  return { token: session.token, expiresAt: session.expiresAt, data: { user: { id: user._id.toString(), name: user.name, email: user.email }, hasWedding: Boolean(wedding) } };
}

export async function forgotPassword(email: string) {
  getEmailEnv(); // Missing provider configuration fails identically for all accounts.
  const user = await User.findOne({ emailNormalized: email.toLowerCase() }).lean();
  if (!user) return;
  const token = newToken();
  const minutes = getAuthPolicy().resetMinutes;
  const reset = await PasswordReset.create({ userId: user._id, tokenHash: hashToken("reset", token), expiresAt: new Date(Date.now() + minutes * 60_000) });
  try {
    await sendPasswordReset(user.email, token, minutes);
  } catch {
    // Provider failure must not disclose account existence in the HTTP response.
    await PasswordReset.deleteOne({ _id: reset._id });
    console.error("Password reset delivery failed.");
  }
}

export async function resetPassword(token: string, password: string) {
  const db = await authDatabase();
  const tokenHash = hashToken("reset", token);
  const candidate = await PasswordReset.findOne({ tokenHash, usedAt: null, expiresAt: { $gt: new Date() } }).lean();
  if (!candidate) throw new ApiError(400, "INVALID_TOKEN", "This reset link is invalid or expired. Request a new link.");
  const passwordHash = await hashPassword(password);
  await db.connection.transaction(async transaction => {
    const now = new Date();
    const claimed = await PasswordReset.findOneAndUpdate({ _id: candidate._id, usedAt: null, expiresAt: { $gt: now } }, { $set: { usedAt: now } }, { session: transaction, returnDocument: "after" });
    if (!claimed) throw new ApiError(400, "INVALID_TOKEN", "This reset link is invalid or expired. Request a new link.");
    const revoke = getAuthPolicy().revokeOnReset;
    const user = await User.updateOne({ _id: claimed.userId }, { $set: { passwordHash }, ...(revoke && { $inc: { authVersion: 1 } }) }, { session: transaction });
    if (!user.matchedCount) throw new ApiError(400, "INVALID_TOKEN", "This reset link is invalid or expired. Request a new link.");
    if (revoke) await AuthSession.deleteMany({ userId: claimed.userId }, { session: transaction });
    await PasswordReset.updateMany({ userId: claimed.userId, usedAt: null }, { $set: { usedAt: now } }, { session: transaction });
  });
}
