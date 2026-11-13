"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  return <div><button className="button" type="button" disabled={pending} onClick={async () => {
    setPending(true); setError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok || response.status === 401) { router.replace("/login"); router.refresh(); return; }
      setError("Could not sign out. Please try again.");
    } catch { setError("Could not connect. Please try again."); }
    finally { setPending(false); }
  }}>{pending ? "Signing out…" : "Sign out"}</button><p role="status">{error}</p></div>;
}
