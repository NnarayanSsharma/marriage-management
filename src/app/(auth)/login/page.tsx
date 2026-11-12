import type { Metadata } from "next";
import { SignInPage } from "@/modules/auth/components/sign-in-page";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Marriage Management wedding workspace.",
};

export default function Page() {
  return <SignInPage />;
}
