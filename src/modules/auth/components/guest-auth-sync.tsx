"use client";

import { useEffect } from "react";

// Re-check a previously rendered guest form when a tab/history entry becomes active.
// Server guards remain authoritative; this covers restored browser UI.
export function GuestAuthSync() {
  useEffect(() => {
    let disposed = false;
    const check = async () => {
      if (document.visibilityState === "hidden") return;
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        if (!response.ok || disposed) return;
        const { data } = await response.json();
        if (!disposed) window.location.replace(data.wedding ? "/app" : "/onboarding/create-wedding");
      } catch { /* Keep the form usable when the network is unavailable. */ }
    };
    void check();
    window.addEventListener("pageshow", check);
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", check);
    return () => {
      disposed = true;
      window.removeEventListener("pageshow", check);
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);
  return null;
}
