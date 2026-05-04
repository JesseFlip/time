---
description: Bootstrap the Quadrant project from an empty repo. Run this exactly once.
---

When the user types `/scaffold`, execute the following sequence and produce artifacts at every step.

### Phase A — Plan
1. Read `AGENTS.md` and `docs/PRD.md` end-to-end.
2. Produce `artifacts/plan_scaffold.md` listing every file that will be created in Phase B-D, grouped by directory.
3. Pause for user approval.

### Phase B — Toolchain
1. `pnpm create next-app@latest . --typescript --tailwind --app --eslint --src-dir=false --import-alias="@/*"`
2. Install runtime deps: `pnpm add @supabase/supabase-js @supabase/ssr @tanstack/react-query zustand dnd-kit @dnd-kit/sortable @dnd-kit/utilities dexie dexie-react-hooks zod react-hook-form @hookform/resolvers lucide-react clsx tailwind-merge serwist @serwist/next`
3. Install dev deps: `pnpm add -D vitest @testing-library/react @testing-library/jest-dom playwright @playwright/test @types/node`
4. `npx shadcn@latest init` — pick Slate, RSC: yes, CSS variables: yes.
5. Add base components: `npx shadcn@latest add button input dialog dropdown-menu toast card badge`

### Phase C — Backend
1. Apply the SQL in §2.2 of the PRD via `supabase/migrations/<ts>_init.sql`.
2. Generate typed client with `pnpm supabase gen types typescript --local > lib/supabase/types.ts`.

### Phase D — App Shell
1. Build the four-quadrant grid at `app/(app)/page.tsx` with placeholder data — verify drag works before wiring sync.
2. Wire auth: `app/auth/*` routes, magic link.
3. Wire Dexie outbox + Supabase realtime in `lib/sync/`.
4. Add manifest + service worker via Serwist.

### Phase E — Verify
Invoke `/verify`. Do not mark scaffold complete until it passes.
