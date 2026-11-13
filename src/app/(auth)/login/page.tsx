import type { Metadata } from "next";
import { SignInPage } from "@/modules/auth/components/sign-in-page";
import { requireSignedOut } from "@/modules/auth/context";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Marriage Management wedding workspace.",
};

export default async function Page() {
  await requireSignedOut();
  return <SignInPage />;
}
