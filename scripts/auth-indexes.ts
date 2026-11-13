import { loadEnvConfig } from "@next/env";
import { connectDatabase } from "../src/server/db/connection";
import { ensureAuthIndexes } from "../src/modules/auth/models";
import mongoose from "mongoose";

async function main() {
  loadEnvConfig(process.cwd());
  try {
    await connectDatabase();
    await ensureAuthIndexes();
    console.log("Authentication indexes provisioned. No indexes were dropped.");
  } catch {
    console.error("Authentication index setup failed. Check the database configuration and existing data.");
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
void main();
