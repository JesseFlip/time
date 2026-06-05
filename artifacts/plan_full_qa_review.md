# Plan: Full QA Review

## Goal
Address the 28 QA issues identified in the Full QA Review for Quadrant (Eisenhower Matrix PWA), categorized into Critical, High, Medium, and Enhancements. The immediate priority is fixing critical PWA/offline bugs, high-priority accessibility/semantic issues, and adding core missing functionality (task edit/completion).

## Affected Files
- `package.json` (Adding `serwist` scripts/configs if missing, checking dependencies)
- `next.config.mjs` or `next.config.ts` (Adding PWA plugin config via `@serwist/next`)
- `app/layout.tsx` (Adding metadata, manifest links, theme colors)
- `app/manifest.ts` (Creating PWA manifest)
- `app/sw.ts` (Service worker implementation)
- `components/quadrant/Header.tsx` (Help dialog fix, sign-in CTA)
- `components/quadrant/HelpDialog.tsx` (Fixing visibility, adding shortcuts info)
- `components/quadrant/TaskCard.tsx` (Semantic HTML fix, aria-labels, edit trigger, completion state)
- `components/quadrant/QuadrantContainer.tsx` (Aria labels for + buttons)
- `components/quadrant/QuadrantGrid.tsx` (Mobile layout adjustments, renaming "DELETE" to "Eliminate")
- `components/mode-toggle.tsx` (Accessibility fixes, focus ring)
- `lib/db/schema.ts` / `store.ts` (Due dates, completion status)
- `lib/supabase/` clients (Sync status logic for "OFFLINE" badge)
- `supabase/migrations/` (New migration for schema updates)

## Risks
- **Service Worker / PWA:** Introducing a service worker can break caching if not configured correctly. Needs careful testing with `pwa-validator`.
- **Data Model Changes:** Adding due dates and completion states requires migrating existing Supabase schema and Dexie.js local schema. Must use `supabase-migration` skill.
- **Accessibility Regressions:** Refactoring `TaskCard` semantics (removing `div role="button"`) might affect drag-and-drop (`dnd-kit`) focus management.

## Test Strategy
1. **PWA Validation:** Run `pwa-validator` skill to ensure Lighthouse 95+, proper offline support, and installability.
2. **Schema Migration:** Use `supabase-migration` and test Dexie.js sync locally before deploying.
3. **E2E Tests:** Update `playwright` tests to verify new Edit/Complete flows and offline behavior.
4. **Accessibility:** Manual screen reader check and automated tests on `TaskCard` and `HelpDialog`.
