# Implementation Plan: Full QA Review

## Goal
Execute fixes for the 28 QA issues in a structured order, prioritizing critical structural and user-facing requirements first.

## Ordered Steps

### Phase 1: Critical PWA & Infrastructure
1. **Manifest & Meta (Issues 1, 5, 25, 27):** 
   - Create `app/manifest.ts` providing the PWA config.
   - Update `app/layout.tsx` to include `metadata`, OG tags, Twitter cards, Apple tags.
   - Add `app/sitemap.ts` and `app/robots.ts`.
2. **Service Worker (Issues 2, 26):**
   - Verify `@serwist/next` is fully configured in Next config and package.json scripts.
   - Create `app/sw.ts` with correct precaching and runtime caching (especially Dexie outbox synchronization).
3. **Structured Data & Layout (Issues 6, 19, 20):**
   - Add JSON-LD to `app/layout.tsx`.
   - Update `QuadrantContainer` to use `<h2>` instead of `<h3>`.
   - Add `loading.tsx` for core routes.

### Phase 2: High-Priority UI & Accessibility
4. **Task Card Semantics (Issues 7, 10, 11, 23):**
   - Refactor `<TaskCard>` into an `<article>` or `<li>` tag.
   - Add a "Done" checkbox and an "Edit" button (triggering an edit dialog).
   - Improve drag-and-drop visuals.
5. **Aria Labels & Theme Toggle (Issues 8, 9, 18):**
   - Add `aria-label` to + buttons in `QuadrantContainer`.
   - Update `mode-toggle.tsx` to have `aria-pressed` or appropriate state hints.
   - Enhance the focus ring (`--ring`) in globals.css.
6. **"OFFLINE" Badge & Help Dialog (Issues 3, 4, 14, 17):**
   - Fix logic in header for "OFFLINE" badge to mean "Not Synced" or check Supabase auth state correctly.
   - Ensure `<HelpDialog>` opens properly. Add keyboard shortcut reference inside it.

### Phase 3: Data Model & Feature Parity
7. **Due Dates & Soft Delete (Issues 10, 11, 13, 16):**
   - Update Dexie schema in `lib/db/store.ts`.
   - Write a Supabase migration to add `due_at` and `completed_at` to the `tasks` table.
   - Add edit modal with date picker.
   - Implement soft-delete with sonner toast for "Undo".
8. **Quadrant Naming & Mobile Layout (Issues 12, 24):**
   - Rename "DELETE" quadrant to "Eliminate" in the UI.
   - Update `QuadrantGrid` to stack on mobile (`< md` breakpoints).

### Phase 4: Polish
9. **Auth CTA & Search (Issues 21, 22):**
   - Add "Sign in" CTA if unauthenticated.
   - Add `cmdk` for global search (`/` or `⌘K`).
10. **Analytics Verification (Issue 28):**
    - Validate analytics initialization.

## SQL Diffs
```sql
-- Migration: add_task_features.sql
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS due_at timestamptz;
-- completed_at already exists in PRD, ensure it is used in UI.
```

## Rollback Note
If the Serwist service worker causes caching issues, roll back by removing `next-pwa` config from `next.config.ts`, deleting `app/sw.ts`, and removing the service worker registration in `app/layout.tsx`. Schema changes are forward-only but can be rolled back via dropping columns if necessary.

## User Review Required
- Please review this plan and verify if the ordering makes sense.
- Does "Eliminate" sound good for the fourth quadrant name?
- Is there any preference for the global search library (e.g., `cmdk`)?
