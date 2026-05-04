---
name: supabase-migration
description: Use this skill whenever the database schema needs to change — adding/altering tables, indexes, RLS policies, or triggers in the Quadrant project's Supabase Postgres database. Loads protocols for writing forward-only, reversible-where-possible migrations and updating the local Dexie cache schema in lockstep.
---

# Supabase Migration Skill

## When to invoke
Any task that involves schema change in `supabase/migrations/` or a new field that must be cached client-side in Dexie.

## Protocol

1. **Never edit a migration that has been merged to `main`.** Write a new one.
2. File naming: `supabase/migrations/<UTC_timestamp>_<snake_case_description>.sql`. Use `date -u +%Y%m%d%H%M%S`.
3. Every migration must include:
   - The schema change (DDL)
   - RLS policy update if a new table is created (deny-by-default)
   - A rollback comment block at the top: `-- Rollback: <SQL or "manual only">`
4. After the SQL is written, update `lib/db/schema.ts` (Dexie version bump + migration function).
5. Run `pnpm supabase:reset` locally to verify the migration applies cleanly to a fresh DB.
6. Add or update a Vitest case in `tests/unit/db/` that exercises the new field through a CRUD round-trip.

## Output template

```sql
-- Migration: <description>
-- Author: <agent_name> via Antigravity
-- Rollback: <plan>

begin;

-- DDL here

commit;
```

## Failure modes to avoid

- Forgetting RLS on a new table (deny-by-default; explicit policy required)
- Using `serial`/`bigserial` instead of `uuid` (we standardize on `gen_random_uuid()`)
- Adding a `not null` column without a default to an existing table — this locks the table on large datasets
