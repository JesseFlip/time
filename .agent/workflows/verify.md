---
description: Run the full Definition-of-Done gauntlet. Required before any PR is marked ready.
---

When the user types `/verify`, run **all** of the following and only proceed to the next on success.

1. `pnpm typecheck` — must exit 0.
2. `pnpm lint` — must exit 0.
3. `pnpm test` — Vitest must pass with ≥ 80% coverage on `lib/`.
4. `pnpm test:e2e` — Playwright must pass.
5. Invoke the `pwa-validator` skill.
6. Run `pnpm build` — must exit 0 with no warnings about missing env vars.
7. Produce `artifacts/verify_<timestamp>.md` summarizing each step's outcome.

If any step fails, **stop**, file the failure in `artifacts/logs/`, and surface it to the user. Do not auto-retry more than once per step.
