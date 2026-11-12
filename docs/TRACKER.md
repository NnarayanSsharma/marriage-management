# Marriage Management V1 — Project Tracker

**Last updated:** 12 November 2026 (Asia/Kolkata)  
**Working branch:** `dev`  
**Latest implementation commit:** `230788d`  
**Current stage:** UI design and Phase 1 foundation preparation

## Start here

The initial scaffold, public homepage design, and sign-in page design are complete.
The homepage and sign-in screen run locally. Authentication and wedding-management
features are not implemented yet.

**Next task:** Create and review the signup design in Google Stitch, matching the
existing sign-in page. No signup design has been created or approved in this
project workflow yet. `/signup` is still a placeholder.

Do not start events or tasks implementation as though Phase 1 were finished.
The PRD's Phase 1 also requires functional authentication, wedding creation, and
wedding-member management.

## Session handoff

Replace this section's values at the end of meaningful work; retain the durable
history in the milestone and decision tables below. This is the current resume
point, not another parallel task list.

| Item | Current handoff — 12 Nov 2026 |
|---|---|
| Last completed task | Added progress tracking and agent workflow instructions; added this handoff, decision history, and completion criteria. |
| Last completed application work | Homepage and sign-in UI, including the sign-in hydration/submission fix, in `230788d`. |
| Unfinished work | Signup design has not started; `/signup` remains a placeholder. Functional authentication and other Phase 1 features remain unimplemented. |
| Blockers / decisions | Password policy must be agreed before final password guidance or functional validation. Other architecture clarifications remain in the open-decisions table. These do not block preparing the signup layout. |
| Exact next action | Prepare desktop/mobile signup designs and an invited-member variant in Stitch, using the existing sign-in styling and the acceptance criteria below. |
| Review / approval checkpoint | Present signup designs for review before treating them as approved for implementation. |
| Repository status | Inspect `git status` and branch synchronization on resume; do not infer current commit/push state from this handoff. |

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
| Sign-in | Yes — Stitch review and user-approved corrections on 12 Nov 2026. | Yes — explicitly a preview. | No — no authentication API or session creation. | UI scope only — validation, password visibility, hydration protection, no credential POSTs, static checks/build. |
| Signup | No. | No — placeholder only. | No. | Not run for signup; design and implementation are pending. |

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

## Where the completed work lives

| Area | Route / files | Scope and limitations |
|---|---|---|
| Homepage | `/`; `src/app/page.tsx`; `src/components/home/` | Public marketing UI. Dashboard, family, and invitation examples contain fictional data. |
| Sign-in | `/login`; `src/app/(auth)/login/page.tsx`; `src/modules/auth/components/` | Local validation and password visibility only. Does not authenticate, send/save credentials, create sessions, or redirect to a private workspace. |
| Fonts | `src/shared/styles/fonts.css`; `public/fonts/plus-jakarta-sans/` | Self-hosted Plus Jakarta Sans and its OFL license. |
| Database connection | `src/server/db/connection.ts` | Reuses a Mongoose connection when called. No live database verification has been performed. |
| Environment configuration | `.env.example`; `src/server/config/env.ts` | Example keys and lazy database validation. External integrations are not configured by the UI work. |
| API contracts | `src/shared/types/api.ts` | Shared response types; no actual Route Handlers. |
| Tooling | `package.json`, `package-lock.json`, `tsconfig.json`, `eslint.config.mjs` | Development, lint, typecheck, and build commands. No test runner or test suite. |
| Hosting configuration | `vercel.json` | Next.js framework declaration only; no deployment or cron schedule. |

The existing `/app/*` pages are public scaffold placeholders with no wedding data.
They are not an authenticated dashboard. Guest/public API directories and token
page directories do not yet implement access or operations.

## Remaining work by PRD phase

| Phase | Deliverable | Current status |
|---|---|---|
| 1 — Foundation | Functional signup, login, logout, current user, password recovery | Sign-in UI complete; backend not started; signup/recovery pages are placeholders. |
| 1 — Foundation | User, Session, reset-token models and required indexes | Not started. |
| 1 — Foundation | Wedding creation, initial Admin membership, onboarding | Placeholder; no workflow or transaction implementation. |
| 1 — Foundation | Member invitations, acceptance, roles, removal, final-Admin protection | Not started. |
| 1 — Foundation | Session checks, authorization, tenant context, CSRF protections, rate limiting | Not started. |
| 1 — Foundation | Private dashboard shell and real summaries | Placeholder; marketing mockups are not the dashboard implementation. |
| 2 — Planning | Events and tasks | Placeholder directories/pages only. |
| 3 — Guests | Guest management, invitation links, RSVP, email, WhatsApp sharing | Placeholder directories/pages only. |
| 4 — Financial and Vendors | Expense tracker, My Vendors, Google Places discovery | Placeholder directories/pages only. |
| 5 — Wedding Experience | Public wedding website, themes, YouTube livestream | Placeholder directories/pages only. |
| 6 — Memories | Gallery, R2 uploads, event albums, guest access, QR sharing | Placeholder directories/pages only. |
| 7 — Production Readiness | Automated tests, security review of functional features, CI, performance, deployment, monitoring | Not started; current lint/build/browser checks cover the scaffold and UI only. |

Shared API error handling, index provisioning, safe logging, provider adapters,
and an isolated test environment remain to be implemented as needed by each phase.
Do not defer authentication and tenant-isolation tests until the final release phase.

## Resume plan: signup design

1. Create desktop and mobile signup screens in Stitch using the existing sign-in visual language.
2. Include only full name, email, and password; add show/hide password, inline error states,
   a **Create account** button, and a link back to sign in.
3. Include an invited-member variant showing which wedding the person is joining and
   the invited email. This is a design requirement, not an implemented invitation flow.
4. Keep wedding details in the subsequent onboarding flow. Do not add guest signup,
   social login, role selection, or email verification.
5. Agree on the password policy before finalizing requirement text or implementing validation.
6. Review the design against the PRD and API contracts, then implement after approval.

### Acceptance criteria for the next task

- Desktop and mobile signup designs are available for review, with their Stitch
  project/screen references recorded here when created.
- Branding, typography, fields, and navigation match the sign-in experience and V1 scope.
- Empty, invalid-input, submitting, and error states are specified, with accessible
  labels and field-level feedback. Prototype state controls are not product UI.
- The invited-member variant identifies the wedding and invited email without
  inventing a new role or a guest-account flow.
- Password guidance is either based on an explicitly agreed policy or clearly
  marked as pending; no policy is silently introduced by the design.
- Review feedback, unresolved decisions, and the user's approval status are recorded
  before treating the design as approved for implementation.

After signup design, review password recovery, wedding creation, invitation
acceptance, and the private dashboard. Complete functional Phase 1 foundations
before progressing to Phase 2 planning features.

## Decisions and clarifications still open

| Decision | Reference / reason | Needed before |
|---|---|---|
| Password policy, hashing library, token/session lifetimes, reset-session invalidation | Approved custom-auth model leaves these implementation choices open. | Functional authentication and final signup password guidance. |
| Authority of dated implementation notes | System/API/database notes describe features and tests absent from this checkout. Do not treat those statements as evidence of completed work. | Implementing affected features. |
| Gallery token persistence | Database §§19–20 specify hash-only storage; API §108 recommends stable raw gallery sharing tokens. | Finalizing Wedding gallery schema and sharing behavior. |
| Public website event/gallery visibility | PRD §§9.18–9.20 and API §69 need a precise public projection/sharing boundary. | Public wedding website and gallery integration. |
| MongoDB rate-counter schema and policies | Notes reference counters that have not been implemented or fully modeled here. | Exposing authentication/public-write endpoints. |
| Task ordering | API §34 specifies newest-created order; §92 gives due-date order. | Task listing implementation. |
| Test tooling and safe index provisioning | No executable tests or index-provisioning script yet; connection helper disables automatic indexes. | Accepting persistent writes and verifying functional Phase 1. |

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

**Not verified:** live MongoDB connectivity, database transactions/indexes, authentication,
tenant isolation with real data, provider integrations, production deployment, or real user journeys.
There are no automated unit, integration, or end-to-end test suites yet.

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
