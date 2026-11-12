import Link from "next/link";
import { SignInForm } from "./sign-in-form";
import styles from "./sign-in.module.css";

function WeddingPreview() {
  return (
    <aside className={styles.showcase} aria-label="Wedding workspace preview">
      <div className={styles.showcaseTop}><span><span aria-hidden="true">✧</span> One shared wedding workspace</span><small>V1 preview</small></div>

      <figure className={styles.previewCard}>
        <figcaption className={styles.sampleBadge}>Illustrative dashboard • sample data</figcaption>
        <h2>Ananya &amp; Aarav’s Wedding</h2>
        <p className={styles.weddingDetails}>14 February 2027 <span aria-hidden="true">•</span> Jaipur, Rajasthan</p>

        <div className={styles.statGrid}>
          {[["Countdown", "42", "days to go"], ["Events", "6", "celebrations"], ["Guest groups", "186", "invitations planned"], ["Tasks", "32/48", "completed"]].map(([label, value, note]) => (
            <div className={styles.stat} key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>
          ))}
        </div>

        <div className={styles.rsvp}>
          <div><strong>Guest RSVP responses</strong><span>186 groups</span></div>
          <div className={styles.progress} aria-hidden="true"><span/><span/><span/></div>
          <ul><li>132 attending</li><li>36 awaiting</li><li>18 declined</li></ul>
        </div>

      </figure>

      <div className={styles.showcaseBottom}>
        <h3>Every detail. One beautiful plan.</h3>
        <p>Plan together with your family, one celebration at a time.</p>
      </div>
    </aside>
  );
}

export function SignInPage() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#sign-in-content">Skip to sign in</a>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Marriage Management home"><span className={styles.brandMark} aria-hidden="true">m<span>♥</span></span><span>Marriage Management</span></Link>
        <Link className={styles.backLink} href="/">Back to home <span aria-hidden="true">↗</span></Link>
      </header>

      <main className={styles.main} id="sign-in-content" tabIndex={-1}>
        <div className={styles.authCard}>
          <section className={styles.formPanel} aria-label="Sign in to your account"><SignInForm/></section>
          <WeddingPreview/>
        </div>
      </main>

      <footer className={styles.footer}><p>© {new Date().getFullYear()} Marriage Management.</p><p>Your Indian Wedding. One Shared Plan.</p></footer>
    </div>
  );
}
