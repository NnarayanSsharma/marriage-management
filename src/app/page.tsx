import type { Metadata } from "next";
import { HomePage } from "@/components/home/home-page";
import { getAuthContext } from "@/modules/auth/context";

export const metadata: Metadata = {
  title: "Marriage Management — Your Indian Wedding. One Shared Plan.",
  description: "One shared workspace for your Indian wedding. Organize events, tasks, guests, invitations, expenses, and memories with your family.",
};

export default async function Page() {
  const context = await getAuthContext();
  return <HomePage accountHref={context ? context.wedding ? "/app" : "/onboarding/create-wedding" : undefined} />;
}
