import "server-only";
import mongoose from "mongoose";
import { getDatabaseEnv } from "@/server/config/env";

type ConnectionCache = { promise: Promise<typeof mongoose> | null };
const globalDatabase = globalThis as typeof globalThis & { marriageDatabase?: ConnectionCache };
const cache = globalDatabase.marriageDatabase ??= { promise: null };

export async function connectDatabase(): Promise<typeof mongoose> {
  if (!cache.promise) {
    const env = getDatabaseEnv();
    cache.promise = mongoose.connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DB_NAME,
      autoIndex: false,
      serverSelectionTimeoutMS: 5000,
    }).catch(() => {
      cache.promise = null;
      throw new Error("Database connection unavailable.");
    });
  }
  return cache.promise;
}
