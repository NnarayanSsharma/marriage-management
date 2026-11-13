"use client";

import Link from "next/link";
import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { emailSchema, passwordSchema } from "../validation";
import styles from "./sign-in.module.css";
import { GuestAuthSync } from "./guest-auth-sync";

type Mode = "signup" | "login" | "forgot-password" | "reset-password";
const subscribe = () => () => {};
const subscribeToHash = (callback: () => void) => {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => { window.removeEventListener("hashchange", callback); window.removeEventListener("popstate", callback); };
};
const headings: Record<Mode, string> = { signup: "Your wedding journey starts here.", login: "Welcome back", "forgot-password": "Forgot your password?", "reset-password": "Choose a new password" };
const actions: Record<Mode, string> = { signup: "Create account", login: "Sign in", "forgot-password": "Send reset link", "reset-password": "Reset password" };

export function AccountForm({ mode, passwordMin }: { mode: Mode; passwordMin?: number }) {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [show, setShow] = useState(false);
  const [pending, setPending] = useState(false);
  const submitting = useRef(false);
  const [complete, setComplete] = useState(false);
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const hash = useSyncExternalStore(subscribeToHash, () => window.location.hash, () => "");
  const [rejectedToken, setRejectedToken] = useState<string | null>(null);
  const token = new URLSearchParams(hash.slice(1)).get("token") ?? "";
  const invalidLink = mode === "reset-password" && hydrated && !complete && (rejectedToken === token || !/^[A-Za-z0-9_-]{43}$/.test(token));
  const newPassword = mode === "signup" || mode === "reset-password";
  const disabled = !hydrated || pending || complete || (newPassword && !passwordMin);

  function validate(input: HTMLInputElement) {
    if (input.name === "name" && !input.value.trim()) return "Enter your full name.";
    if (input.name === "email" && !emailSchema.safeParse(input.value).success) return "Enter a valid email address.";
    if (input.name === "password") {
      if (!input.value) return "Enter your password.";
      if (newPassword && passwordMin) {
        const result = passwordSchema(passwordMin).safeParse(input.value);
        if (!result.success) return result.error.issues[0].message;
      }
    }
    return "";
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || disabled) return;
    const form = event.currentTarget;
    const invalid: Record<string, string> = {};
    for (const input of form.querySelectorAll<HTMLInputElement>("input")) {
      const message = validate(input);
      if (message) invalid[input.name] = message;
    }
    setErrors(invalid); setNotice("");
    if (Object.keys(invalid).length) {
      form.querySelector<HTMLInputElement>(`[name="${Object.keys(invalid)[0]}"]`)?.focus();
      return;
    }
    const body = Object.fromEntries(new FormData(form));
    if (mode === "reset-password") {
      body.token = token;
      if (!body.token) { setNotice("This reset link is invalid. Request a new link."); return; }
    }
    submitting.current = true; setPending(true);
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) {
        if (result.error?.code === "ALREADY_AUTHENTICATED") {
          window.location.replace(new URL("/login", window.location.origin).href);
          return;
        }
        if (mode === "reset-password" && (result.error?.details?.token || ["INVALID_TOKEN", "TOKEN_EXPIRED"].includes(result.error?.code))) {
          setRejectedToken(token);
          setNotice("This reset link is invalid or expired. Request a new link.");
          return;
        }
        setErrors(result.error?.details ?? {});
        setNotice(result.error?.message ?? "Unable to continue. Please try again.");
        const first = Object.keys(result.error?.details ?? {})[0];
        if (["name", "email", "password"].includes(first)) form.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
        return;
      }
      if (mode === "signup" || mode === "login") {
        window.location.replace(new URL(result.data.hasWedding ? "/app" : "/onboarding/create-wedding", window.location.origin).href);
        return;
      }
      form.reset(); setComplete(true);
      if (mode === "reset-password") window.history.replaceState(null, "", "/reset-password");
      setNotice(mode === "forgot-password" ? "If an account exists for this email, we’ll send a password reset link. Check your inbox and spam folder." : "Your password has been changed. Sign in with your new password.");
    } catch { setNotice("We couldn’t connect. Please try again. If you just created an account, try signing in."); }
    finally { submitting.current = false; setPending(false); }
  }

  const field = (name: "name" | "email" | "password", label: string) => <div className={styles.field}>
    <div className={styles.labelRow}><label htmlFor={`account-${name}`}>{label}</label>
      {name === "password" && <button type="button" disabled={disabled} className={styles.visibilityToggle} aria-controls="account-password" aria-pressed={show} onClick={() => setShow(!show)}>{show ? "Hide" : "Show"} password</button>}
    </div>
    <input id={`account-${name}`} name={name} disabled={disabled} type={name === "password" ? show ? "text" : "password" : name === "email" ? "email" : "text"}
      autoComplete={name === "name" ? "name" : name === "email" ? mode === "signup" ? "email" : "username" : newPassword ? "new-password" : "current-password"}
      autoCapitalize={name === "name" ? "words" : "none"} spellCheck={false} required maxLength={name === "name" ? 100 : name === "email" ? 254 : 512}
      placeholder={name === "name" ? "Your full name" : name === "email" ? "you@example.com" : newPassword ? "Create a password" : "Enter your password"}
      aria-invalid={Boolean(errors[name])} aria-describedby={`${name === "password" && newPassword ? "password-guidance " : ""}${errors[name] ? `${name}-error` : ""}`.trim() || undefined}
      onBlur={event => { const message = validate(event.currentTarget); setErrors(current => ({ ...current, [name]: message })); }}
      onChange={event => { const message = errors[name] ? validate(event.currentTarget) : ""; setErrors(current => ({ ...current, [name]: message })); setNotice(""); }} />
    {name === "password" && newPassword && <p className={styles.guidance} id="password-guidance">{passwordMin ? `Use ${passwordMin}–128 characters. Spaces are welcome; no symbols required.` : "Password requirements are being configured."}</p>}
    {errors[name] && <p id={`${name}-error`} className={styles.fieldError}>{errors[name]}</p>}
  </div>;

  if (invalidLink) return <div className={styles.formContent}>
    <span className={styles.badge}>Account recovery</span>
    <h1>This reset link is invalid or expired</h1>
    <p className={styles.intro}>Request a new link to change your password.</p>
    <p className={styles.formStatus} role="status">{notice}</p>
    <p className={styles.signupPrompt}><Link href="/forgot-password">Request a new reset link</Link></p>
    <p className={styles.signupPrompt}><Link href="/login">Back to sign in</Link></p>
  </div>;

  return <div className={styles.formContent}>
    {(mode === "login" || mode === "signup") && <GuestAuthSync/>}
    <span className={styles.badge}>✦ Wedding workspace</span><h1>{headings[mode]}</h1>
    <p className={styles.intro}>{mode === "signup" ? "Create your account. Bring your people together." : mode === "login" ? "Sign in to your wedding workspace." : mode === "forgot-password" ? "Enter your account email and we’ll send you a reset link." : "Use a password you haven’t used elsewhere."}</p>
    <noscript><p className={styles.previewNotice}>Enable JavaScript to use this account form.</p></noscript>
    {newPassword && !passwordMin && <p className={styles.previewNotice}>Account setup is being configured. Please check back shortly.</p>}
    <form method="post" noValidate onSubmit={submit} aria-busy={pending}>
      {mode === "signup" && field("name", "Full name")}
      {mode !== "reset-password" && field("email", "Email address")}
      {mode !== "forgot-password" && field("password", mode === "reset-password" ? "New password" : "Password")}
      {mode === "login" && <div className={styles.forgotRow}><Link href="/forgot-password">Forgot password?</Link></div>}
      <button className={styles.submit} type="submit" disabled={disabled}>{pending ? "Please wait…" : actions[mode]} <span aria-hidden="true">→</span></button>
      <p className={styles.formStatus} role="status" aria-live="polite">{notice}</p>
    </form>
    <p className={styles.signupPrompt}>{mode === "login" ? <>New to Marriage Management?<br/><Link href="/signup">Create your account ↗</Link></> : <Link href="/login">{mode === "signup" ? "Already have an account? Sign in" : "Back to sign in"}</Link>}</p>
    {mode === "reset-password" && <p className={styles.signupPrompt}><Link href="/forgot-password">Request a new reset link</Link></p>}
    <p className={styles.memberNote}>{mode === "signup" ? "Wedding setup follows account creation. Guests use their invitation links." : "For wedding members. Guests use their invitation links."}</p>
  </div>;
}
