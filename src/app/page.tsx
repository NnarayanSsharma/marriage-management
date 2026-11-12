import type { Metadata } from "next";
import { HomePage } from "@/components/home/home-page";

export const metadata: Metadata = {
  title: "Marriage Management — Your Indian Wedding. One Shared Plan.",
  description: "One shared workspace for your Indian wedding. Organize events, tasks, guests, invitations, expenses, and memories with your family.",
};

export default function Page() {
  return <HomePage />;
}
