<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project continuity and progress tracking

### Before starting work

- Read [docs/TRACKER.md](docs/TRACKER.md) to understand completed work, current
  limitations, open decisions, and the next task. Check the repository and Git
  status to confirm that the tracker still matches the code.
- Read the applicable parts of the approved PRD, system design, database design,
  and API design before implementing the affected feature. The tracker records
  progress; it does not override architecture or the user's current instructions.
- Preserve existing user changes. Report conflicting requirements instead of
  silently changing approved decisions.

### During and after work

- Update the tracker whenever a milestone is completed, scope materially changes,
  or an important blocker or decision is discovered. Do not add noise for every
  minor edit or command.
- Record the deliverable, relevant files/routes, verification performed, remaining
  limitations, and exact next task. Maintain acceptance criteria for the next task.
- Refresh the tracker's session handoff when the resume point changes, keeping its
  completed task, unfinished work, blockers, and next action consistent with the
  tracker summary. Preserve resolved choices in decision history with their date,
  rationale, and approval/reference; do not silently delete their context.
- Distinguish UI completion from functional implementation and verification.
  Placeholders, mock data, empty folders, and design notes are not working features.
- Keep the last-updated date and current phase accurate; preserve milestone history.
  Attribute past checks to their milestone rather than implying they cover later changes.
- Record commit hashes and push status only after verifying those actions succeeded.
  Avoid permanent statements about a clean working tree or pending changes that
  become stale on the next commit. Use Git for current repository status.
- When a commit is authorized, include relevant tracker updates alongside the
  implementation. Do not create extra commits merely to record a commit's own hash.
  Tracking instructions do not independently authorize commits, pushes, or deployments.
- Keep the README focused on setup and its link to the tracker. Use the tracker as
  the single progress record; do not create competing status files.
- Never record credentials, raw access tokens, signed URLs, or private user data
  in the tracker or other repository documentation.

For read-only reviews, report tracker discrepancies without editing any files.
Keep this project-maintained section outside the generated Next.js block above.
