"use client";

import Link from "next/link";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import styles from "./sign-in.module.css";

type Field = "email" | "password";

// The server snapshot keeps the form inert until React attaches its handlers.
const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

function validationMessage(input: HTMLInputElement) {
  if (input.validity.valueMissing) {
    return input.name === "email" ? "Enter your email address." : "Enter your password.";
  }
  if (input.validity.typeMismatch) return "Enter a valid email address, such as you@example.com.";
  return "";
}

export function SignInForm() {
  const isHydrated = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<Record<Field, string>>({ email: "", password: "" });

  function validateField(input: HTMLInputElement) {
    const field = input.name as Field;
    setErrors(current => ({ ...current, [field]: validationMessage(input) }));
  }

  function handleInvalid(event: FormEvent<HTMLInputElement>) {
    event.preventDefault();
    const input = event.currentTarget;
    validateField(input);
    if (input.form?.querySelector("input:invalid") === input) input.focus();
    setNotice("");
  }

  function handleChange(input: HTMLInputElement) {
    if (errors[input.name as Field]) validateField(input);
    setNotice("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Design preview only: do not send, persist, or log entered credentials.
    setNotice("Sign-in is not available yet. Your details have not been sent or saved. Please return when account access is ready.");
  }

  return (
    <div className={styles.formContent}>
      <span className={styles.badge}><span aria-hidden="true">✦</span> Wedding workspace</span>
      <h1>Welcome back</h1>
      <p className={styles.intro}>Sign in to your wedding workspace.</p>

      <p id="sign-in-preview-note" className={styles.previewNotice}>
        <strong>V1 design preview</strong>
        Account access is coming next. This form does not sign you in.
      </p>

      <noscript><p className={styles.previewNotice}>Enable JavaScript to interact with this sign-in preview.</p></noscript>

      <form method="post" onSubmit={handleSubmit} aria-describedby="sign-in-preview-note">
        <div className={styles.field}>
          <label htmlFor="sign-in-email">Email address</label>
          <input id="sign-in-email" name="email" disabled={!isHydrated} type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="you@example.com" required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "sign-in-email-error" : undefined} onInvalid={handleInvalid} onBlur={event => validateField(event.currentTarget)} onChange={event => handleChange(event.currentTarget)} />
          {errors.email && <p id="sign-in-email-error" className={styles.fieldError} role="alert">{errors.email}</p>}
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label htmlFor="sign-in-password">Password</label>
            <button type="button" disabled={!isHydrated} className={styles.visibilityToggle} aria-controls="sign-in-password" aria-pressed={showPassword} aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>{showPassword && <path d="m3 3 18 18"/>}</svg>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input id="sign-in-password" name="password" disabled={!isHydrated} type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" required aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "sign-in-password-error" : undefined} onInvalid={handleInvalid} onBlur={event => validateField(event.currentTarget)} onChange={event => handleChange(event.currentTarget)} />
          {errors.password && <p id="sign-in-password-error" className={styles.fieldError} role="alert">{errors.password}</p>}
        </div>

        <div className={styles.forgotRow}><Link href="/forgot-password">Forgot password?</Link></div>

        <button type="submit" disabled={!isHydrated} className={styles.submit}>Sign In <span aria-hidden="true">→</span></button>
        <p className={styles.formStatus} role="status" aria-live="polite">{notice}</p>
      </form>

      <p className={styles.signupPrompt}>New to Marriage Management?<br/><Link href="/signup">Create your account <span aria-hidden="true">↗</span></Link></p>
      <div className={styles.memberNote}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg><span>For wedding members. Guests use their invitation links.</span></div>
    </div>
  );
}
