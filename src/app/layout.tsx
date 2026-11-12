import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "@/shared/styles/fonts.css";

export const metadata: Metadata = {
  title: { default: "Marriage Management", template: "%s | Marriage Management" },
  description: "A shared workspace for planning your wedding.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
