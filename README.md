# Marriage Management V1

A local Next.js App Router scaffold for the approved TypeScript modular monolith.
The four documents in `docs/` remain the architecture baseline.

See [the project tracker](docs/TRACKER.md) for completed work, remaining phases,
open decisions, and the next task to resume.

## Local development

Use Node.js 22 and npm. Install with `npm ci`, then run `npm run dev`.
Open http://localhost:3000. Run `npm run check` for ESLint and TypeScript,
`npm run build` for a production build, and `npm start` to serve that build.

Copy `.env.example` to `.env.local` when integrations are needed. Never commit
credentials. The current pages render without external services; no database
connection is attempted until a future service calls `connectDatabase()`.
Use isolated development credentials and data.

## Current scope

The public homepage at `/` implements the reviewed Google Stitch landing-page
design with V1-aligned copy, responsive navigation, native FAQ disclosures, and
illustrative dashboard/invitation previews. Previews use fictional information
and do not perform wedding operations. Signup remains a placeholder. The sign-in
page at `/login` implements the reviewed Stitch design with password visibility,
native required-field validation, and a clear preview-only submission message.
It sends no credentials and creates no session. Password recovery remains a
placeholder. Sign-in UI lives in `src/modules/auth/components`.
Homepage styles are scoped in `src/components/home`;
Plus Jakarta Sans is self-hosted with its license in `public/fonts`.
Its shared font declarations live in `src/shared/styles/fonts.css`.

The scaffold includes route groups, a workspace preview, feature placeholders,
shared API response types, lazy server-only database configuration, and a cached
Mongoose connection helper. It does not implement authentication, authorization,
CRUD, guest token access, email delivery, storage, or cron processing.
`/app/*` currently contains public placeholder content only, with no wedding data.
Real dashboard pages and private APIs must enforce session and membership checks
before any data is added. Token routes have directories only and return 404.
No API endpoints are registered yet. No deployment or cron schedule is configured.
Root noindex metadata is a scaffold default; published wedding metadata must be
handled explicitly when the public website feature is implemented.

## Organization and boundaries

- `src/app`: Next.js pages, layouts, and thin REST adapters.
- `src/modules`: domain UI, contracts, Zod schemas, services, models, and repositories.
- `src/components`: domain-independent UI, forms, and layouts.
- `src/server`: server-only configuration, security, HTTP helpers, database access,
  provider adapters, and logging. Protect implementations with `server-only`.
- `src/shared`: browser-safe contracts, hooks, configuration, and utilities.
- `tests`: integration/E2E suites and fixtures; unit tests live beside their modules.
- `scripts`: future explicit maintenance tools; no startup index synchronization.

Repositories must require wedding context for wedding-owned data. Services enforce
business rules and same-wedding references. Routes derive context from sessions,
never client wedding IDs. Client code must not import server models or services.
Cross-module workflows should use explicit service interfaces.

`guests` owns Guest persistence; `invitations` coordinates sharing and RSVP.
`gallery` owns gallery settings/access; `photos` owns photo upload lifecycle.
`email` owns templates and jobs; `server/email` owns the provider adapter.
Empty folders use `.gitkeep` until implementation is needed. Do not create fake
handlers, credentials, domain models, or test success placeholders.

## Decisions still required

Before the relevant features, confirm gallery token persistence, public website
visibility rules, dated implementation-note authority, authentication policies,
and the MongoDB rate-counter schema. See API section 108 versus database sections
19–20 for gallery tokens. Authentication libraries, UI/form/data fetching packages,
provider SDKs, and test runners are intentionally not selected yet.

Follow the PRD phases: foundation, planning, guests, expenses/vendors, website and
livestream, memories, then production readiness. This scaffold is not a production
ready application. Original architecture documents have not been edited.
