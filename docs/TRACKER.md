# Marriage Management V1 — Project Tracker

**Last updated:** 13 November 2026 (Asia/Kolkata)<br>
**Working branch:** `dev`  
**Latest implementation commit:** `230788d`  
**Current stage:** Phase 1 authentication implemented and locally verified; live recovery and wedding workflows pending

## Start here

The homepage and connected account UI are implemented. Authentication is verified
against an isolated database, with signup/login/logout also checked on localhost:3000.
Signed-in login/signup access, repeat-auth requests, homepage account links and
reset-link feedback have now been corrected. Real reset-email delivery remains
blocked by missing Resend settings. Wedding creation/member invitations are pending.

**Next task:** Configure Resend locally and verify real reset-email delivery and
password changes with an authorized recipient. Then review wedding creation/onboarding.

Do not start events or tasks implementation as though Phase 1 were finished.
The PRD's Phase 1 also requires functional authentication, wedding creation, and
wedding-member management.

## Session handoff

Replace this section's values at the end of meaningful work; retain the durable
history in the milestone and decision tables below. This is the current resume
point, not another parallel task list.

| Item | Current handoff — 13 Nov 2026 |
|---|---|
| Last completed task | Fixed the signed-in auth-entrypoint and reset-link UX findings: server/page guards, repeat-auth API rejection, membership-aware homepage controls, browser restoration checks, and clear invalid-reset states. Verification recorded below. |
| Last completed application work | Authentication implementation and fixes prepared for the user-authorized commit to `dev`; latest prior application baseline is `230788d`. Use Git for the resulting commit. |
| Unfinished work | Resend setup/live recovery verification, deployment-specific abuse controls, wedding creation, and member invitations. |
| Blockers / decisions | Product policy confirmation remains pending for the proposed password/session/reset choices. Local policy settings are valid per the signup availability check; configured development MongoDB connectivity and auth indexes have been verified. Resend delivery remains unverified. |
| Exact next action | Configure RESEND_API_KEY and EMAIL_FROM locally and obtain an authorized recipient; repeat recovery through the delivered link and verify password changes and old-session revocation on localhost:3000. Review deployment-specific capacity/trusted-client throttling before public exposure. |
| Review / approval checkpoint | User authorized committing all current changes and pushing to `dev` on 13 Nov 2026. Deployment is outside this task. |
| Repository status | Inspect Git on resume. Preserve previous tracker edits; do not infer clean/pushed state from this handoff. |

## How to maintain this tracker

- Read this file before beginning a new work session.
- Update it after each completed milestone, material scope change, or discovered blocker.
- Record what actually exists, its relevant files/routes, and how it was verified.
- Distinguish a finished design from functional backend behavior.
- Treat empty directories, sample data, and placeholder pages as scaffolding only.
- Move the next-task entry forward when work is completed; retain the milestone history.
- Refresh the session handoff when the resume point changes, keeping it consistent with "Start here" and the resume plan.
- When an open decision is resolved, record its date, chosen option, reason, and approval/reference in decision history before removing it from the open table.
- Record commits after they exist. Never put credentials, invitation tokens, or signed URLs here.
- This file tracks implementation status; it does not replace or amend approved architecture.

Status meanings:

| Status | Meaning |
|---|---|
| Complete | The named deliverable is implemented and checked within its stated scope. |
| UI complete | Design is implemented; functional behavior may still be pending. |
| Partial | Some foundation or UI exists, but the deliverable is incomplete. |
| Placeholder | Only a route shell or empty directory exists. |
| Not started | No implementation exists. |
| Decision needed | Clarification is required before implementing the affected behavior. |

### Completion criteria

Record the applicable stages separately for each feature. A UI milestone can be
complete while its backend is still not started. Use **Not applicable** with a
reason for stages that do not apply, such as backend work for a marketing page.

| Stage | Evidence needed to mark it complete |
|---|---|
| Design approved | A reviewable design/reference exists, scope matches V1, and user approval is recorded. |
| UI implemented | The agreed layout, responsive behavior, navigation, and relevant form/accessibility states are implemented; mock data and placeholders are identified. |
| Backend connected | Real APIs, validation, persistence, permissions, tenant isolation, and required integrations work for the feature. A simulated action is insufficient. |
| Verification passed | Relevant checks have run against the implementation; record the commands/scenarios, results, and limits. UI checks do not establish backend correctness. |

Current feature checkpoints:

| Feature | Design approved | UI implemented | Backend connected | Verification passed |
|---|---|---|---|---|
| Homepage | Yes — Stitch review and user-approved refinements on 12 Nov 2026. | Yes. | Not applicable — marketing content and sample illustrations. | UI scope only — lint, types, build, responsive layouts, links, menu, FAQs. |
| Sign-in | Yes — reviewed Stitch styling retained. | Yes — connected account form with inline errors and pending state. | Implemented; requires configured MongoDB, policy, token secret, and provisioned indexes. | Isolated HTTP/database tests pass; see current verification. |
| Signup | User authorized the reviewed feature implementation on 13 Nov 2026. | Yes — corrected Stitch styling and responsive form. | Implemented; disabled until policy configuration exists. | Isolated HTTP/database tests pass; browser results recorded below. |
| Password recovery | Uses the shared account visual style. | Yes — request/reset forms. | Implemented with Resend adapter and atomic single-use reset; live provider configuration pending. | Token/reset behavior tested; provider mocked, no actual email sent. |

## Completed milestones

| Date | Deliverable | Status | What was completed |
|---|---|---|---|
| 12 Nov 2026 | Architecture documentation review | Complete | Read the PRD, system design, database design, and API design; recorded important conflicts and missing decisions. |
| 12 Nov 2026 | Initial project scaffold | Complete | Next.js App Router, TypeScript, npm lockfile, ESLint, route groups, domain folders, configuration templates, and placeholder pages. |
| 12 Nov 2026 | Shared database foundation | Partial | Server-only, lazy environment validation and cached Mongoose connection helper; no models or database operations. |
| 12 Nov 2026 | Scaffold audit | Complete | Reviewed architecture alignment, repository organization, security boundaries, dependencies, and readiness; identified Phase 1 work still required. |
| 12 Nov 2026 | Local application smoke check | Complete | Scaffold routes returned expected responses; unimplemented routes returned 404. |
| 12 Nov 2026 | Public homepage | UI complete | Implemented the reviewed Stitch design, responsive navigation, FAQs, local icons, self-hosted fonts, and illustrative previews. |
| 12 Nov 2026 | Homepage refinements | UI complete | Clearer Indian-wedding headline, earlier family collaboration, three feature groups, privacy explanation, availability notes, and a shorter mobile preview. |
| 12 Nov 2026 | Sign-in page | UI complete | Implemented the reviewed Stitch design at `/login`, corrected branding and scope, responsive layout, and sample dashboard. |
| 12 Nov 2026 | Sign-in refinements | UI complete | Clearer supporting copy, smaller dashboard preview, readable labels, inline validation, and show/hide password. |
| 12 Nov 2026 | Sign-in preview submission fix | Complete | Disabled credential fields and buttons until hydration; added a no-JavaScript message; verified no credential POSTs in either mode. |
| 12 Nov 2026 | Code review | Complete | Final review found no remaining actionable issues in the reviewed changes. |
| 12 Nov 2026 | Development branch baseline | Complete | Scaffold and subsequent homepage/sign-in changes committed and pushed to `origin/dev`. |
| 12 Nov 2026 | Project continuity documentation | Complete | Created this tracker, linked it from the README, added tracker-maintenance instructions to `AGENTS.md`, and established session handoff, decision history, and completion criteria; no application behavior changed. |
| 13 Nov 2026 | Authentication implementation | Partial | Connected account UI/APIs, session guards, reset adapter, auth index tooling and seven isolated integration/browser tests. Live policy/service configuration and actual email delivery remain pending. |

## Where the completed work lives

| Area | Route / files | Scope and limitations |
|---|---|---|
| Homepage | `/`; `src/app/page.tsx`; `src/components/home/` | Public marketing UI. Dashboard, family, and invitation examples contain fictional data. |
| Authentication | `/login`, `/signup`, `/forgot-password`, `/reset-password`; `src/modules/auth/`; `src/app/api/auth/` | Real account/session APIs and connected forms; explicit policy/service configuration required. No wedding creation or invitation acceptance. |
| Fonts | `src/shared/styles/fonts.css`; `public/fonts/plus-jakarta-sans/` | Self-hosted Plus Jakarta Sans and its OFL license. |
| Database connection | `src/server/db/connection.ts` | Reuses a Mongoose connection when called. Development connectivity/topology and auth-index readiness verified on 13 Nov; isolated tests verify transactions. |
| Environment configuration | `.env.example`; `src/server/config/env.ts` | Example keys and lazy server-only configuration validation. Ignored local MongoDB/policy settings are configured; live Resend setup remains pending. |
| Auth APIs | `src/app/api/auth/`; `src/modules/auth/handlers.ts` | Signup, login, logout, me, forgot-password, reset-password; error envelopes, no-store responses, CSRF origin checks and rate limits. |
| Tooling | `package.json`; `tests/auth.integration.test.ts`; `scripts/auth-indexes.ts` | Node test runner with tsx, disposable MongoDB replica set, optional Chrome verification, explicit additive auth-index provisioning. |
| Hosting configuration | `vercel.json` | Next.js framework declaration only; no deployment or cron schedule. |

The `/app/*` placeholders now require a session and wedding membership. Users
without a wedding reach an authenticated account-ready onboarding screen. Wedding
creation and actual dashboard data remain pending. Guest/token routes remain unimplemented.

## Remaining work by PRD phase

| Phase | Deliverable | Current status |
|---|---|---|
| 1 — Foundation | Functional signup, login, logout, current user, password recovery | Implemented; verified in isolated tests. Policy confirmation and real service/email setup pending. |
| 1 — Foundation | User, Session, reset-token models and required indexes | Implemented; explicit provisioning tested against disposable MongoDB and successfully run against the configured development database. |
| 1 — Foundation | Wedding creation, initial Admin membership, onboarding | Placeholder; no workflow or transaction implementation. |
| 1 — Foundation | Member invitations, acceptance, roles, removal, final-Admin protection | Not started. |
| 1 — Foundation | Session checks, authorization, tenant context, CSRF protections, rate limiting | Auth sessions, origin checks and persisted counters implemented; membership projection reads authenticated user only. Full feature-level role/tenant authorization remains pending. |
| 1 — Foundation | Private dashboard shell and real summaries | Placeholder; marketing mockups are not the dashboard implementation. |
| 2 — Planning | Events and tasks | Placeholder directories/pages only. |
| 3 — Guests | Guest management, invitation links, RSVP, email, WhatsApp sharing | Placeholder directories/pages only. |
| 4 — Financial and Vendors | Expense tracker, My Vendors, Google Places discovery | Placeholder directories/pages only. |
| 5 — Wedding Experience | Public wedding website, themes, YouTube livestream | Placeholder directories/pages only. |
| 6 — Memories | Gallery, R2 uploads, event albums, guest access, QR sharing | Placeholder directories/pages only. |
| 7 — Production Readiness | Automated tests, security review of functional features, CI, performance, deployment, monitoring | Auth integration/browser tests now exist. CI, deployment, performance and broader feature/security verification remain pending. |

Auth now has safe error handling, explicit indexes, a reset-email adapter, and an
isolated test environment. Extend these foundations for later domains as needed.
Do not defer authentication and tenant-isolation tests until the final release phase.

## Design review history and current resume plan

Stitch project `15757682208805435613` was reviewed on 12 Nov 2026.
Signup screen `2a51050ac7644fabad52239522a69786` supplied the implemented visual
reference. Invitation screen `f20a0e4451e2457c8fd7a5a6badb787c` had its HTML inspected;
screenshot review and functional invitation implementation remain pending.

The approved signup corrections retain the sign-in typography and burgundy/blush
palette, use Marriage Management branding, and limit account fields to name, email,
and password. Unsupported roles, vendor visibility, concierge/legal placeholders,
and unapproved password rules were excluded. Signup and connected account UI are
implemented; the earlier design-only delivery plan is superseded by the milestones below.

Invitation acceptance must identify the validated wedding, invited email and actual
Admin/Manager role, support existing-account sign-in, and enforce invitation context
on the server. The invited-member variant remains part of the invitation backlog.

### Acceptance criteria for the next task: live password recovery

- Configure local Resend settings with a verified sender and an authorized recipient;
  keep credentials, recipient data and raw links out of repository documentation.
- Request recovery through the running app and verify actual inbox delivery.
- Follow the delivered fragment link, change the password, reject the old password,
  and accept the new password. Verify single-use/expired-link feedback and session
  revocation according to the configured policy.
- Record results and limits separately from intercepted-provider tests. Resolve product
  policy confirmation before claiming the authentication milestone fully accepted.
- Then review wedding creation/onboarding against the approved designs, including
  atomic initial Admin membership creation, tenant isolation and failure handling.
  Complete Phase 1 before beginning Phase 2.

## Decisions and clarifications still open

| Decision | Reference / reason | Needed before |
|---|---|---|
| Password policy, hashing library, token/session lifetimes, reset-session invalidation | Approved custom-auth model leaves these implementation choices open. | Functional authentication and final signup password guidance. |
| Authority of dated implementation notes | System/API/database notes describe features and tests absent from this checkout. Do not treat those statements as evidence of completed work. | Implementing affected features. |
| Gallery token persistence | Database §§19–20 specify hash-only storage; API §108 recommends stable raw gallery sharing tokens. | Finalizing Wedding gallery schema and sharing behavior. |
| Public website event/gallery visibility | PRD §§9.18–9.20 and API §69 need a precise public projection/sharing boundary. | Public wedding website and gallery integration. |
| Rate-limit capacity and trusted-proxy policy | Auth uses an explicitly documented `auth_rate_counters` collection with unique keys and TTL. Per-email/action and per-reset-token buckets work across instances; shared global caps were removed after review. Production capacity and any trusted-client-IP strategy need review. | Public production launch and additional public-write endpoints. |
| Task ordering | API §34 specifies newest-created order; §92 gives due-date order. | Task listing implementation. |
| Broader test and index coverage | Node test runner/tsx and additive auth-index provisioning now exist and are tested. Wedding-domain index tooling and isolation suites remain pending. | Accepting wedding-domain writes. |

## Decision history

Keep resolved decisions here rather than losing their context. Record only
choices supported by the session or approved documents; do not infer agreement
from an implementation or an unresolved recommendation. If a decision is later
replaced, append the replacement and identify which earlier entry it supersedes.

| Date | Decision / chosen option | Reason | Approval / reference |
|---|---|---|---|
| 12 Nov 2026 | Implement the public homepage before functional account workflows. | Establish the product's visual direction, then proceed step by step. | User approved the homepage-first sequence and Stitch implementation in this session. |
| 12 Nov 2026 | Preserve the Stitch visual identity while correcting V1 scope mismatches. | Keep the design consistent without advertising excluded budgeting, fine-grained roles, transport, or dietary workflows. | User approved the homepage and sign-in design-review corrections; implementation in `230788d`. |
| 12 Nov 2026 | Keep sign-in as an explicitly labeled UI preview until authentication is implemented; prevent credential submission before hydration. | Avoid simulated successful authentication or accidental native submission of credentials. | User approved sign-in UI work and requested the review finding be fixed; implementation in `230788d`. |
| 12 Nov 2026 | Use `docs/TRACKER.md` as the single progress record, linked from the README and maintained through `AGENTS.md`. | Preserve an accurate resume point without competing status files. | User requested the tracker and agent instructions, then approved handoff and decision-history additions. |
| 13 Nov 2026 | Implement connected account flows using the approved custom-auth architecture and corrected signup design. | Establish the foundation for wedding onboarding. Supersedes preview-only form behavior; policy values remain pending confirmation. | User: “Can you go ahead and start building this feature?” |

## Verification recorded so far

These checks passed during the scaffold/homepage/sign-in work. They are a record
of completed verification, not a substitute for running checks after future changes.

- `npm run check`: ESLint and TypeScript with generated route types.
- `npm run build`: successful production compilation and static page generation.
- Browser checks at phone, tablet, and desktop widths, including 320px, 390px,
  768px, 1024px, and 1440px as applicable.
- Homepage navigation, mobile menu, Escape/focus behavior, FAQ disclosures, and anchors.
- Sign-in required-field/email validation, inline error recovery, password visibility,
  preview-only submission, and hydration behavior.
- No credential POSTs with JavaScript enabled or disabled; no browser errors in those checks.

**At the earlier UI milestone:** MongoDB/authentication/provider integration were
not verified and no test suite existed. The 13 Nov authentication verification below
supersedes that test-suite status; real development provider setup remains pending.

## Commit history

| Commit | Branch | Deliverable | Remote status at completion |
|---|---|---|---|
| `fefa2d8` | `dev` | Initial scaffold and architecture documents | Pushed to `origin/dev`. |
| `230788d` | `dev` | Responsive homepage and sign-in design previews, refinements, and hydration fix | Pushed to `origin/dev`. |

Use Git to check current uncommitted changes and branch synchronization. The table
above records verified implementation milestones, not a live repository-status snapshot.

## Architecture references

- [Product requirements](PRD.md) — available filename is `PRD.md`, not `PRD(1).md`.
- [System design](SYSTEM_DESIGN.md)
- [Database design](DATABASE_DESIGN.md)
- [API design](API_DESIGN.md)

When architecture documents and implementation status disagree, report the discrepancy.
Do not silently resolve architectural contradictions or mark a feature complete based on design notes alone.

## Authentication implementation — 13 Nov 2026

User authorized starting the feature after the authentication plan. Earlier signup
review/acceptance text above records the planning context; signup UI is now implemented.
The prior preview-only submission decision is superseded for connected account forms.

- Added User, Session, PasswordResetToken and auth-rate-counter schemas, unique/TTL
  indexes, explicit additive provisioning, and index-readiness checks before writes.
- Added Argon2id (19 MiB, two iterations, parallelism one), HMAC token storage,
  HttpOnly/SameSite cookies, explicit expiry, origin validation, bounded JSON parsing,
  safe error envelopes, and persistent rate counters (the original global bucket was subsequently removed; see the rate-limit fix below).
- Added signup/login/logout/me/recovery REST handlers. Signup and reset use transactions.
  User `authVersion` metadata prevents reset-revoked sessions becoming valid again.
- Added corrected Stitch signup styling and connected accessible account forms, loading,
  validation and error states. Credential controls remain inert until hydration.
- Added authenticated account-ready onboarding and session/membership page guards.
  These do not implement wedding creation or member invitation acceptance.
- Added Resend reset-email adapter. Links use fragments to keep raw tokens out of
  server request URLs. Delivery failure logs only a fixed diagnostic and preserves
  generic recovery responses; no raw token is logged or persisted.
- Proposed policy values remain pending confirmation via the outstanding user question.
  Required environment values allow testing without silently selecting live policy.
- Added `npm test`, `npm run db:auth-indexes`, setup guidance, and isolated test output.

Current verification: six integration scenarios passed against a disposable real
MongoDB replica set and HTTP test server; `npm run check` and production build passed.
Scenarios cover normalized duplicates, concurrent signup, cookie sessions, expiry,
logout, membership projection, page guards, validation, origin rejection, request-size
limits, rate limits, concurrent reset reuse, password changes, and reset revocation.
The optional Chrome scenario also passed (seven total tests): signup at 320/390/768/1440px,
no horizontal overflow, inline errors, real signup-to-onboarding navigation, and
disabled controls/empty FormData without JavaScript. The desktop screenshot was
visually inspected. `npm run check` passed again after adding the browser scenario.
Resend is mocked: actual email delivery, production deployment, production Secure-cookie
transport, and wedding feature authorization have not been verified.

## Configuration and full-journey check — 13 Nov 2026

- Initial audit found no `.env` file or populated authentication settings. At the
  user’s request, created `.env.local` from the template with private file permissions
  and a generated token secret; verified Git ignores it. No values are recorded here.
- User will supply the MongoDB URI and database name. Policy values and Resend
  credentials remain unconfigured; no external database or real email was used.
- Extended the tests to intercept the Resend HTTP call in the test child process
  through `tests/support/resend-stub.cjs` and capture messages in an ephemeral local
  mailbox. Application/provider code contains no alternative test endpoint.
- Recovery integration now exercises the actual forgot-password HTTP handler,
  replacing the earlier direct service call. The browser now exercises signup,
  logout, login, recovery request, emailed-fragment reset, old-password rejection,
  new-password login, and revocation of the previous session.
- All seven integration/browser scenarios passed. No functional bug was reproduced
  in these scenarios. Local MongoDB connectivity and actual inbox delivery are still
  blocked by missing configuration; isolated tests do not establish provider readiness.

## Development MongoDB connection check — 13 Nov 2026

- User supplied local MongoDB settings. Initial URI parsing failed because credential
  characters required URL encoding. Verified the encoded candidate with a read-only
  connection/ping and topology check, then saved the corrected URI in the ignored
  local environment file without exposing values.
- Connection succeeded and the server reports a transaction-capable topology.
  This establishes connectivity, not transaction write permissions or auth-index readiness.
- No database documents, collections, or indexes were changed by this check.
  Authentication index provisioning and actual email delivery remain pending.

## Local signup availability fix — 13 Nov 2026

- Diagnosed the reported service-unavailable signup message: MongoDB connected and
  auth policy settings were valid, but all four auth collections lacked required indexes.
- Ran the existing additive `npm run db:auth-indexes` command successfully against
  the configured development database. Existing data/indexes were not deleted.
- The application’s `authDatabase()` readiness check now passes. An intentionally
  invalid signup request to the running local app returned HTTP 400 VALIDATION_ERROR
  rather than HTTP 503, confirming the index blocker is resolved without creating an account.
- Real account signup can now be retried by the user. Actual email delivery and the
  previously reported global rate-limit defect remain outstanding.

## Chrome check against running localhost:3000 — 13 Nov 2026

- Used headless Chrome with rendered UI interactions against the user’s existing
  local server and configured development database, rather than the isolated test server.
- Created two synthetic QA accounts across the initial and confirmation runs;
  existing accounts were not changed. QA records remain in the development database.
- Confirmed signup (201), current user (200), reload persistence, logout (200),
  post-logout session rejection (401), private-page redirect, incorrect-password
  rejection (401), correct login (200), second logout (200), duplicate email (409),
  empty-field errors and password visibility. No browser runtime exceptions observed.
- The initial second-logout click occurred before navigation finished and produced
  no request. Repeating after the account page loaded passed; no logout defect reproduced.
- Forgot-password returned HTTP 503. RESEND_API_KEY and EMAIL_FROM are missing.
  Invalid reset-token submission returned HTTP 400. No real email was sent.
- Actual reset-link delivery, successful password update, and resulting session
  revocation could not be tested in this environment. Prior intercepted-email tests
  establish those code paths only, not live provider functionality.
- Application code was not changed during this manual-test task.

## Authentication rate-limit review fix — 13 Nov 2026

- User requested the actionable review issue be fixed. Removed the shared global
  action bucket that allowed one caller to block unrelated accounts.
- Validate request fields before selecting rate-limit identities. Signup/login retain
  10-attempt per-email/action windows, recovery requests retain 3, and reset submissions
  now use separate 10-attempt buckets per token. Keys remain HMACs with TTL cleanup.
- Logout bypasses the abuse limiter while retaining same-origin validation,
  authentication, server-side session deletion and cookie clearing. Anonymous requests
  return 401 and cannot exhaust logout for authenticated users.
- Existing global counter documents are no longer consulted and expire naturally;
  no database cleanup or new indexes were necessary. This supersedes the original
  global-cap design described in historical implementation notes above.
- Added regressions for more than 100 attempts against a throttled account, unrelated
  account login, anonymous logout flooding, successful subsequent logout, and reset-token
  isolation/non-disclosure. All nine integration/browser tests passed against disposable
  MongoDB with intercepted email; `npm run check` and `npm run build` passed. Real service configuration and accounts were not changed.
- Arbitrary forwarded IP headers remain untrusted. Deployment-level capacity controls
  and a trusted-client identity strategy remain a production-launch task; no shared
  fallback bucket was introduced.

## Signed-in authentication edge-case audit — 13 Nov 2026

User reported login remaining visible after authentication and asked for a verified
issue list. Checked the rendered UI and network responses in Chrome on localhost:3000.
No application code was changed during this audit.

Confirmed issues:

1. `/login` remains visible with a valid session, including when navigating Back
   after login. `/signup` also remains visible. Neither page checks current auth
   context or redirects authenticated users to their workspace/onboarding destination.
2. Submitting login with an existing valid session returns HTTP 200 and performs
   login again. The handler has no already-authenticated guard. Sequential login
   replaces the browser's old session; this is not evidence of duplicate valid sessions.
3. A signed-in user can submit signup for a different email (HTTP 201), creating
   a second account and replacing the current account session without an explicit
   sign-out/account-switch flow. This was reproduced using two synthetic QA accounts.
4. The signed-in homepage header continues to show Log In/Get Started, with no
   workspace/onboarding destination. Its controls do not reflect session state.
5. Malformed reset tokens produce HTTP 400 and “Check the highlighted fields,” but
   zero fields are highlighted and the token-specific validation detail is not rendered.
   With no token, the form initially accepts a new password and rejects on submit;
   an invalid-link state before asking for a password would improve this flow.

Configuration blocker (not a newly reproduced code defect): forgot-password still
returns HTTP 503 because Resend settings are missing. Real email delivery, valid-link
password changes, and old-session revocation remain unverified in this environment.
The previous isolated intercepted-email tests cover their code paths only.

Checks still passing in this audit: authenticated current-user lookup, logout after
account switching, and unauthenticated onboarding redirect. Prior signup/login and
rate-limit regression evidence remains scoped to the recorded scenarios; it did not
cover signed-in access to public auth entry points. No single-device-only policy has
been approved, so independent sessions on different devices are not classified as a bug.

## Signed-in authentication and reset-link fixes — 13 Nov 2026

User authorized fixing the confirmed audit findings.

- Login/signup pages now check server-side session context and redirect signed-in
  users to `/app` with membership, or `/onboarding/create-wedding` without membership.
- Login/signup APIs reject authenticated requests with HTTP 409 ALREADY_AUTHENTICATED
  before account/session creation. Existing session/cookie stays intact; signup cannot
  silently create and switch to a different account while signed in.
- Successful authentication replaces the current history entry. A guest-form client
  helper rechecks sessions on mount, pageshow, focus and visibility restoration to
  handle stale tabs/history in addition to the authoritative server guards.
- Homepage navigation, mobile links, footer links and planning CTAs now use the
  membership-aware destination instead of login/signup for signed-in users.
- Missing/malformed reset fragments show a clear invalid-link screen before password
  entry. Server token errors/expired links transition to that screen with a recovery
  link rather than “Check the highlighted fields” with no highlighted input.
- Added integration checks for signed-in pages with/without membership, repeat login,
  prevented signup/account switching, unchanged session count, homepage links, and
  browser checks for auth-page redirects and missing/malformed/expired reset links.
- Final verification passed all ten integration/browser scenarios, including the
  explicit Browser Back regression. `npm run check` and `npm run build` passed.
  Tests used disposable MongoDB and intercepted email; no existing local accounts
  or service credentials were modified.
- Actual email delivery is still unverified; missing Resend settings are an external
  configuration blocker and were not simulated as a successful live integration.

## Tracker reconciliation and release preparation — 13 Nov 2026

- User requested a repository/tracker audit, tracker updates, and committing all current
  changes to `dev` followed by a push to `origin/dev`.
- Reconciled stale database/index readiness, signup-only resume instructions, and the
  previous commit/push authorization restriction with the recorded implementation.
- Backlog remains: real recovery email delivery and policy confirmation; deployment
  capacity/trusted-proxy controls; wedding creation with initial Admin membership;
  invitation acceptance/member lifecycle; private dashboard and later PRD phases.
- `.env.local` is ignored and excluded from the commit. No deployment is included.
- Current verification: `npm run check`, `npm run build`, and `git diff --check` passed.
  Full authentication/browser rerun passed all ten tests (zero failures/skips), using
  disposable MongoDB and intercepted email. Initial sandbox socket denial was resolved
  by rerunning with local socket access; it was not an application test failure.
- Commit/push outcome must be verified with Git; this entry does not predeclare success.
