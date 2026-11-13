import Link from "next/link";
import { redirect } from "next/navigation";
import { requirePageAuth } from "@/modules/auth/context";
import { LogoutButton } from "@/modules/auth/components/logout-button";

export default async function Page() {
  const context = await requirePageAuth();
  if (context.wedding) redirect("/app");
  return <main className="container"><p className="eyebrow">Your account is ready</p><h1>Welcome, {context.user.name}</h1><p>You are signed in as {context.user.email}.</p><p>Wedding creation is the next feature under development. Your account is saved, but you do not have a wedding workspace yet.</p><p>If you were invited to a wedding, invitation acceptance will be available in the member-management milestone.</p><LogoutButton/><Link href="/">Back to home</Link></main>;
}
