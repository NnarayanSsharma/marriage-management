"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./home.module.css";

const links = [["#features", "Features"], ["#how-it-works", "How It Works"], ["#why-marriage-management", "Why Marriage Management"], ["#faqs", "FAQs"]] as const;

export function HomeHeader({ accountHref }: { accountHref?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return <header className={styles.header} onKeyDown={(event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      document.getElementById("home-menu-toggle")?.focus();
    }
  }}>
    <div className={styles.headerInner}>
      <Link href="/" className={styles.brand} aria-label="Marriage Management home"><span className={styles.brandMark} aria-hidden="true">m<span>♥</span></span><span>Marriage Management</span></Link>
      <nav className={styles.desktopNav} aria-label="Main navigation">{links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}</nav>
      <div className={styles.headerActions}>{!accountHref && <Link className={styles.login} href="/login">Log In</Link>}<Link className={styles.smallButton} href={accountHref ?? "/signup"}>{accountHref ? accountHref === "/app" ? "My Workspace" : "Continue Setup" : "Get Started"}</Link><button id="home-menu-toggle" className={styles.menuToggle} type="button" aria-expanded={isOpen} aria-controls="home-mobile-menu" aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"} onClick={() => setIsOpen(!isOpen)}><span aria-hidden="true">{isOpen ? "✕" : "☰"}</span></button></div>
    </div>
    <nav id="home-mobile-menu" className={styles.mobileNav} aria-label="Mobile navigation" hidden={!isOpen}>{links.map(([href, label]) => <a key={href} href={href} onClick={() => setIsOpen(false)}>{label}</a>)}<Link href={accountHref ?? "/login"} onClick={() => setIsOpen(false)}>{accountHref ? accountHref === "/app" ? "My Workspace" : "Continue Setup" : "Log In"}</Link></nav>
  </header>;
}
