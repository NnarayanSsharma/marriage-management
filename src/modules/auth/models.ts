import "server-only";
import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true }, email: { type: String, required: true },
  emailNormalized: { type: String, required: true }, passwordHash: { type: String, required: true, select: false },
  // A per-user version serializes password resets and session creation across races.
  authVersion: { type: Number, default: 0, required: true },
}, { timestamps: true, collection: "users" });
userSchema.index({ emailNormalized: 1 }, { unique: true });

const sessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true }, tokenHash: { type: String, required: true },
  authVersion: { type: Number, required: true }, expiresAt: { type: Date, required: true },
}, { timestamps: { createdAt: true, updatedAt: false }, collection: "sessions" });
sessionSchema.index({ tokenHash: 1 }, { unique: true });
sessionSchema.index({ userId: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const resetSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true }, tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true }, usedAt: { type: Date, default: null },
}, { timestamps: { createdAt: true, updatedAt: false }, collection: "password_reset_tokens" });
resetSchema.index({ tokenHash: 1 }, { unique: true });
resetSchema.index({ userId: 1 });
resetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const counterSchema = new Schema({
  key: { type: String, required: true }, count: { type: Number, required: true }, expiresAt: { type: Date, required: true },
}, { collection: "auth_rate_counters" });
counterSchema.index({ key: 1 }, { unique: true });
counterSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

type UserRecord = InferSchemaType<typeof userSchema>;
type SessionRecord = InferSchemaType<typeof sessionSchema>;
type ResetRecord = InferSchemaType<typeof resetSchema>;
type CounterRecord = InferSchemaType<typeof counterSchema>;
export const User = (models.User as Model<UserRecord>) || model("User", userSchema);
export const AuthSession = (models.AuthSession as Model<SessionRecord>) || model("AuthSession", sessionSchema);
export const PasswordReset = (models.PasswordReset as Model<ResetRecord>) || model("PasswordReset", resetSchema);
export const AuthRateCounter = (models.AuthRateCounter as Model<CounterRecord>) || model("AuthRateCounter", counterSchema);

// Additive provisioning only: never syncIndexes/drop approved indexes on startup.
export async function ensureAuthIndexes() {
  await Promise.all([User.createIndexes(), AuthSession.createIndexes(), PasswordReset.createIndexes(), AuthRateCounter.createIndexes()]);
}
