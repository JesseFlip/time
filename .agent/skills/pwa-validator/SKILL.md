---
name: pwa-validator
description: Use this skill before marking any task done that touches the service worker, manifest, offline behavior, or installability. Runs Lighthouse, verifies offline mode in the built-in browser, and confirms install prompts on Chromium. Required for the Definition of Done.
---

# PWA Validator Skill

## When to invoke
- Before closing any task that touched: `app/manifest.ts`, `app/sw.ts`, `lib/sync/*`, or service worker registration
- As part of `/verify`

## Protocol

1. Run `pnpm build && pnpm start` to serve a production build (Lighthouse only trusts prod builds).
2. Open the built-in Antigravity browser to `http://localhost:3000`.
3. Run Lighthouse with category `PWA, Performance, Accessibility`. Save the JSON to `artifacts/lighthouse_<task_id>.json`.
4. Toggle **Offline** in DevTools, navigate to `/`, then `/q/do`, then add a task. Confirm the task appears optimistically and the outbox count increments.
5. Toggle Online; confirm the outbox drains within 5 seconds and the task appears in Supabase via the `select_user_tasks` query in `lib/supabase/debug.ts`.
6. Save a `.webm` of steps 4-5 to `artifacts/walkthrough_<task_id>.webm`.

## Pass thresholds

| Metric | Min |
|---|---|
| PWA score | 95 |
| Performance | 90 |
| Accessibility | 95 |
| Best Practices | 90 |

If any threshold fails, do not mark the task done. File the failures in `artifacts/logs/<task_id>.log` and surface them to the user.
