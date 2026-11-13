import "server-only";
import argon2 from "argon2";
import { randomBytes } from "node:crypto";

export const hashPassword = (password: string) => argon2.hash(password, {
  type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1,
});
let dummyHash: Promise<string> | undefined;
export async function verifyPassword(hash: string | undefined, password: string) {
  dummyHash ??= hashPassword(randomBytes(32).toString("hex"));
  // Missing accounts still perform password verification to reduce enumeration.
  const result = await argon2.verify(hash ?? await dummyHash, password);
  return Boolean(hash) && result;
}
