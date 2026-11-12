import Link from "next/link";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <><header><Link href="/">Marriage Management</Link><p>Scaffold preview · authentication is not implemented</p><nav aria-label="Workspace"><Link href="/app">Overview</Link><Link href="/app/events">Events</Link><Link href="/app/tasks">Tasks</Link><Link href="/app/guests">Guests</Link><Link href="/app/expenses">Expenses</Link><Link href="/app/vendors">Vendors</Link><Link href="/app/website">Website</Link><Link href="/app/photos">Photos</Link><Link href="/app/livestream">Livestream</Link><Link href="/app/settings/wedding">Settings</Link></nav></header>{children}</>;
}
