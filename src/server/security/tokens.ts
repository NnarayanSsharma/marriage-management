import "server-only";
import { createHmac, randomBytes } from "node:crypto";
import { getTokenSecret } from "@/server/config/env";

export const newToken = () => randomBytes(32).toString("base64url");
export const validToken = (token: string) => /^[A-Za-z0-9_-]{43}$/.test(token);
export const hashToken = (purpose: string, token: string) => createHmac("sha256", getTokenSecret()).update(`${purpose}:${token}`).digest("hex");
