# Marriage Management V1

A Next.js App Router application following the approved TypeScript modular monolith.
The four architecture documents in `docs/` remain the baseline. See
[the project tracker](docs/TRACKER.md) for progress, decisions, and the next task.

## Local development

Use Node.js 22 and npm. Run `npm ci`, then `npm run dev` and open
http://localhost:3000. `npm run check` runs ESLint and TypeScript;
`npm run build` creates a production build and `npm start` serves it.

The homepage and account layouts render without integrations. To use authentication,
copy `.env.example` to `.env.local` and configure:

- `NEXT_PUBLIC_APP_URL`: the exact browser origin; HTTPS is required in production.
- `MONGODB_URI` and `MONGODB_DB_NAME`: an isolated development Atlas database or
  local replica set. Authentication uses transactions; standalone MongoDB is insufficient.
- `TOKEN_HASH_SECRET`: at least 32 random characters, kept stable and server-only.
  Generate a value locally with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.
- `AUTH_PASSWORD_MIN_LENGTH`, `AUTH_SESSION_DAYS`, `AUTH_RESET_MINUTES`, and
  `AUTH_RESET_REVOKE_SESSIONS`: explicit policy settings. Proposed values are
  `15`, `7`, `30`, and `true`; confirmation remains pending in the tracker.
- `RESEND_API_KEY` and `EMAIL_FROM`: required for password recovery. Use a sender
  verified in your own Resend account.

Never commit credentials or use production data for development. Do not paste secrets
into the tracker. `SESSION_SECRET` is reserved; opaque sessions use `TOKEN_HASH_SECRET`.
Changing that secret invalidates existing session/reset tokens and rate-limit keys.

Before accepting authentication writes, run `npm run db:auth-indexes` against the
configured development database. This creates required collections/indexes without
removing existing indexes. Missing required indexes cause authentication to fail closed.
Production index provisioning is a separate explicit deployment step.

## Current scope

The public homepage implements the reviewed Google Stitch design. Dashboard and
invitation illustrations contain fictional data. Account pages provide signup,
sign-in, logout, and password recovery through `/api/auth/*`. They use Argon2id,
MongoDB sessions, HttpOnly/SameSite cookies, origin checks, and shared MongoDB
rate counters. Limits are isolated per email and action: 10 attempts per 15-minute
window, or 3 for password-recovery requests. Reset submissions have separate
10-attempt buckets per reset token. Logout requires authentication and same-origin
checks and has no shared abuse bucket. Counter keys are HMACs; raw addresses/tokens
are not stored and arbitrary forwarded IP headers are not trusted. Deployment-specific
capacity and trusted-proxy throttling still need review before public launch.

Login and signup are for signed-out users. Valid sessions redirect those pages to
`/app` or onboarding, and their APIs return `409 ALREADY_AUTHENTICATED` without
replacing the active session or creating another account. Restored guest forms
recheck session state on browser history/focus events. Homepage account links and
planning buttons use the same membership-aware destination. Invalid/missing reset
links show a recovery action rather than asking for a password.

Policy settings are required before signup/reset are enabled. Missing database,
index, or provider configuration produces a safe error rather than simulated success.
Reset links use a URL fragment so raw tokens are absent from server request URLs.
Email-provider failures return the same generic recovery response and emit only a
fixed diagnostic; actual email delivery still needs verification with configured Resend.

`/app/*` now requires a valid session and wedding membership. Users without a wedding
reach an authenticated account-ready screen at `/onboarding/create-wedding`.
Wedding creation, member invitation acceptance, and all wedding CRUD remain pending.
These pages do not claim to complete onboarding. Homepage and auth styles share
self-hosted Plus Jakarta Sans; fonts and license live in `public/fonts`.
No deployment, cron processing, guest token access, or storage integration is implemented.
Root noindex metadata remains a development default.

## Verification

`npm test` runs Node's test runner through `tsx`, creates a disposable MongoDB replica
set, provisions its indexes, and starts a separate Next.js server on port 3108.
It never uses your configured development database. The first run may download a
MongoDB test binary. Port 3108 must be available. Tests cover real HTTP/database
behavior; Resend HTTP delivery is intercepted by a test-only preload and local
mailbox, and sends no real email.

For the additional browser check, set `CHROME_PATH` to your Chrome executable before
running `npm test`. That check uses port 9228 and a temporary browser profile; it
covers responsive signup, inline validation, logout/login, intercepted-email
password recovery, password changes/session revocation, and disabled controls
without JavaScript. Without `CHROME_PATH`, only this optional browser check is skipped.
The test build is isolated under `.next/auth-test` from the developer's running server.

## Organization and boundaries

- `src/app`: pages, layouts, and thin REST adapters.
- `src/modules`: domain UI, validation, services, and models.
- `src/server`: server-only configuration, security, HTTP helpers, database access,
  and external-service adapters.
- `src/shared`: browser-safe contracts and utilities.
- `tests`: integration/browser verification; `scripts`: explicit maintenance tools.

Repositories for wedding-owned data must require wedding context. Services enforce
permissions and same-wedding references. Future private APIs must call authentication
and authorization helpers themselves; a page layout is not an API authorization boundary.
Client code must not import server services/models. `guests` owns guest persistence;
`invitations` coordinates sharing/RSVP; `gallery` owns access and `photos` owns uploads.
Empty directories remain scaffolding, not working features.

Consult the tracker before implementing unresolved gallery-token/public-visibility
contracts or task ordering. Follow the PRD phases and retain authentication and
isolation verification as features grow. This application is not yet production ready.
