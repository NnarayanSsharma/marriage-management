import { currentUser } from "@/modules/auth/handlers";

export const runtime = "nodejs";
export const GET = currentUser;
