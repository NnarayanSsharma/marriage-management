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
