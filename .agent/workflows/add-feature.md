---
description: Vertical-slice a new feature end-to-end with plan, code, tests, and walkthrough.
---

When the user types `/add-feature <description>`, follow the strict Plan → Execute → Verify loop.

### 1. Plan (artifact required)
Produce `artifacts/plan_<slug>.md`:
- User story this implements
- Files touched
- New routes / migrations / env vars
- Test strategy (which units, which e2e)
- Risks + rollback

### 2. Implementation Plan (artifact required)
Produce `artifacts/implementation_plan_<slug>.md`:
- Ordered steps with file paths and pseudo-diffs
- SQL diff if migration required (invoke `supabase-migration` skill)
- Pause and ask the user to review both artifacts before writing code.

### 3. Execute
- Implement step-by-step.
- Add Vitest unit tests *with* the implementation, not after.
- Add a Playwright e2e covering the user story's happy path.

### 4. Verify
- Invoke `/verify`.
- Generate `artifacts/walkthrough_<slug>.md` with screenshots and a short narrative of the user flow.

### 5. Hand-off
- Open a draft PR with the artifact links pasted into the PR body.
- Stop and surface to the user.
