import "server-only";
import { connectDatabase } from "@/server/db/connection";
import { AuthRateCounter, AuthSession, PasswordReset, User } from "./models";

let ready: Promise<void> | undefined;
export async function authDatabase() {
  const db = await connectDatabase();
  ready ??= (async () => {
    // Refuse persistent writes until the explicit provisioning command was run.
    for (const model of [User, AuthSession, PasswordReset, AuthRateCounter]) {
      const indexes = await model.collection.listIndexes().toArray();
      for (const [key, options] of model.schema.indexes()) {
        if (!indexes.some(index => JSON.stringify(index.key) === JSON.stringify(key)
          && (!options.unique || index.unique === true)
          && (options.expireAfterSeconds === undefined || index.expireAfterSeconds === options.expireAfterSeconds))) {
          throw new Error("Authentication indexes require provisioning.");
        }
      }
    }
  })().catch(error => { ready = undefined; throw error; });
  await ready;
  return db;
}
