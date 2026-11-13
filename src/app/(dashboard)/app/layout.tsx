import Link from "next/link";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requirePageAuth } from "@/modules/auth/context";
import { LogoutButton } from "@/modules/auth/components/logout-button";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const context = await requirePageAuth();
  if (!context.wedding) redirect("/onboarding/create-wedding");
  return <><header><Link href="/">Marriage Management</Link><p>Signed in as {context.user.name} · wedding features are under development</p><LogoutButton/><nav aria-label="Workspace"><Link href="/app">Overview</Link><Link href="/app/events">Events</Link><Link href="/app/tasks">Tasks</Link><Link href="/app/guests">Guests</Link><Link href="/app/expenses">Expenses</Link><Link href="/app/vendors">Vendors</Link><Link href="/app/website">Website</Link><Link href="/app/photos">Photos</Link><Link href="/app/livestream">Livestream</Link><Link href="/app/settings/wedding">Settings</Link></nav></header>{children}</>;
}
