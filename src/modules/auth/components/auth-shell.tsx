import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./sign-in.module.css";

export function AuthShell({ children }: { children: ReactNode }) {
  return <div className={styles.page}>
    <a className={styles.skipLink} href="#account-content">Skip to account form</a>
    <header className={styles.header}>
      <Link className={styles.brand} href="/" aria-label="Marriage Management home"><span className={styles.brandMark} aria-hidden="true">m<span>♥</span></span><span>Marriage Management</span></Link>
      <Link className={styles.backLink} href="/">Back to home <span aria-hidden="true">↗</span></Link>
    </header>
    <main className={styles.main} id="account-content" tabIndex={-1}>
      <div className={styles.authCard}>
        <section className={styles.formPanel} aria-label="Your account">{children}</section>
        <aside className={styles.showcase} aria-label="Plan together">
          <div className={styles.showcaseTop}><span>One shared plan for both families</span></div>
          <svg className={styles.rings} viewBox="0 0 300 180" fill="none" aria-hidden="true"><circle cx="115" cy="90" r="65" stroke="#8d354f" strokeWidth="3"/><circle cx="185" cy="90" r="65" stroke="#c2a15f" strokeWidth="3"/><path d="M150 60v60M135 90h30" stroke="#8d354f" strokeWidth="2"/></svg>
          <div className={styles.previewCard}><span className={styles.sampleBadge}>Plan together</span><h2>Your people. Your celebrations.</h2><p className={styles.weddingDetails}>Bring events, tasks, and guest invitations into one wedding workspace.</p></div>
          <div className={styles.showcaseBottom}><h3>From Mehendi to the reception.</h3><p>A shared place to organize the details with your family.</p></div>
        </aside>
      </div>
    </main>
    <footer className={styles.footer}><p>© {new Date().getFullYear()} Marriage Management.</p><p>Your Indian Wedding. One Shared Plan.</p></footer>
  </div>;
}
