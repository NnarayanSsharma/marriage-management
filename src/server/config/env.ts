import "server-only";
import { z } from "zod";

const databaseSchema = z.object({
  MONGODB_URI: z.string().trim().regex(/^mongodb(?:\+srv)?:\/\//),
  MONGODB_DB_NAME: z.string().trim().min(1),
});

// Validate lazily: static pages and builds do not require live credentials.
// Never include raw values or Zod errors in logs or client responses.
export function getDatabaseEnv() {
  const result = databaseSchema.safeParse({
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
  });
  if (!result.success) throw new Error("Database configuration is missing or invalid.");
  return result.data;
}

export function getAppOrigin() {
  const result = z.url().safeParse(process.env.NEXT_PUBLIC_APP_URL);
  if (!result.success) throw new Error("Application URL is missing or invalid.");
  const url = new URL(result.data);
  if (!['http:', 'https:'].includes(url.protocol) || (process.env.NODE_ENV === "production" && url.protocol !== "https:")) {
    throw new Error("Application URL must use HTTPS in production.");
  }
  return url.origin;
}

export function getTokenSecret() {
  const secret = process.env.TOKEN_HASH_SECRET;
  if (!secret || secret.length < 32) throw new Error("Token hashing configuration is missing or invalid.");
  return secret;
}

export function getEmailEnv() {
  const result = z.object({ RESEND_API_KEY: z.string().min(1), EMAIL_FROM: z.string().min(3) }).safeParse({
    RESEND_API_KEY: process.env.RESEND_API_KEY, EMAIL_FROM: process.env.EMAIL_FROM,
  });
  if (!result.success) throw new Error("Email configuration is missing or invalid.");
  return result.data;
}
