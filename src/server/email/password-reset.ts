import "server-only";
import { getAppOrigin, getEmailEnv } from "@/server/config/env";

export async function sendPasswordReset(email: string, token: string, minutes: number) {
  const env = getEmailEnv();
  // A fragment keeps the raw token out of HTTP access logs and referrer headers.
  const url = `${getAppOrigin()}/reset-password#token=${encodeURIComponent(token)}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.EMAIL_FROM, to: [email], subject: "Reset your Marriage Management password", text: `Use this link to reset your password:\n${url}\n\nThis link expires in ${minutes} minutes and can be used once. If you did not request this, you can ignore this email.` }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error("Password reset email delivery failed.");
}
