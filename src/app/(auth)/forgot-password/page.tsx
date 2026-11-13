import { AuthShell } from "@/modules/auth/components/auth-shell";
import { AccountForm } from "@/modules/auth/components/account-form";
import { getAuthPolicy } from "@/modules/auth/policy";

export const dynamic = "force-dynamic";
export const metadata = { title: "Forgot password", referrer: "no-referrer" as const };
export default function Page() {
  let passwordMin: number | undefined;
  try { passwordMin = getAuthPolicy().passwordMin; } catch { /* Configuration is required before account creation. */ }
  return <AuthShell><AccountForm mode="forgot-password" passwordMin={passwordMin}/></AuthShell>;
}
