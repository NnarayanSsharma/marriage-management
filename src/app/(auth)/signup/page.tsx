import { AuthShell } from "@/modules/auth/components/auth-shell";
import { AccountForm } from "@/modules/auth/components/account-form";
import { getAuthPolicy } from "@/modules/auth/policy";
import { requireSignedOut } from "@/modules/auth/context";

export const dynamic = "force-dynamic";
export const metadata = { title: "Create an account", referrer: "no-referrer" as const };
export default async function Page() {
  await requireSignedOut();
  let passwordMin: number | undefined;
  try { passwordMin = getAuthPolicy().passwordMin; } catch { /* Configuration is required before account creation. */ }
  return <AuthShell><AccountForm mode="signup" passwordMin={passwordMin}/></AuthShell>;
}
