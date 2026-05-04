# Eisenhower Matrix PWA — Requirements Document & Antigravity Hand-Off Package

> **Purpose:** This single document is both a Product Requirements Document (PRD) **and** the kickoff prompt for Google Antigravity IDE agents. It contains every artifact Antigravity needs to scaffold, build, verify, and deploy the project end-to-end: project brief, architecture, data model, `AGENTS.md`, skill definitions, workflow slash commands, and the initial agent dispatch prompt.

---

# Part 1 — Product Brief (the *What*)

## 1.1 Project Name

**Quadrant** — A cross-device Eisenhower Matrix PWA.

## 1.2 One-Line Pitch

Capture every task, drag it into one of four quadrants (Urgent/Important × Not-Urgent/Not-Important), and have it sync instantly to every device you own — online or off.

## 1.3 Goals (in priority order)

1. **Frictionless capture.** Adding a task should take less than two seconds from any device.
2. **Forced prioritization.** The Eisenhower 2×2 is the *primary* UI — not a side feature.
3. **Real cross-device sync.** A task added on phone shows on laptop in under one second when both are online; queues and resolves cleanly when offline.
4. **Offline-first.** App is fully usable with zero network. No spinners blocking input.
5. **Installable everywhere.** PWA installs on iOS, Android, Windows, macOS, Linux, ChromeOS.
6. **Honest tech debt.** Codebase is hand-off-ready: typed, tested, documented.

## 1.4 Non-Goals (explicit; the agent should not build these)

- ❌ Team collaboration / shared boards (single-user only in v1)
- ❌ AI auto-classification of tasks (out of scope; can be added later as a Skill)
- ❌ Native mobile apps (PWA is the target)
- ❌ Calendar integrations (Google/Apple/Outlook) — out of scope for v1
- ❌ Time tracking / Pomodoro (separate concern)
- ❌ Payments / subscriptions

## 1.5 Target Users

| Persona | Need | Why this app |
|---|---|---|
| **The Operator** (PM, founder, knowledge worker) | Stop reacting; surface what's actually important | Quadrant forces the Important-vs-Urgent distinction |
| **The Career-Switcher** (e.g., bootcamp learner) | Balance study, job search, life | Visual quadrant prevents tunnel vision on one area |
| **The ADHD Brain** | Externalize the to-do firehose | Drag-to-categorize > endless flat lists |

## 1.6 Core User Stories (v1 must-haves)

```
US-01 As a user, I can sign up / sign in with email magic-link so I have one synced account.
US-02 As a user, I can add a task in under 2 seconds from any quadrant or a global "+" button.
US-03 As a user, I can drag a task between quadrants; the move syncs across my devices.
US-04 As a user, I can edit a task's title, notes, due date, and tags inline.
US-05 As a user, I can mark a task complete; completed tasks fade and move to an "Archive" view.
US-06 As a user, I can use the app fully offline; my changes sync automatically when I reconnect.
US-07 As a user, I can install the app on my phone and desktop home screen.
US-08 As a user, I can search/filter tasks by text, tag, due date, and quadrant.
US-09 As a user, I can export all my tasks as JSON or CSV.
US-10 As a user, I can switch between dark and light themes; the choice persists.
US-11 As a user, I can use keyboard shortcuts (n=new, /=search, 1-4=jump quadrant, e=edit).
US-12 As a user, I can opt-in to Web Push notifications for tasks due today.
```

## 1.7 Quadrant Semantics (must match the UI exactly)

| Quadrant | Label | Meaning | Default action |
|---|---|---|---|
| Q1 | **DO** | Urgent **and** Important | Work it now |
| Q2 | **SCHEDULE** | Important, **not** Urgent | Pick a due date |
| Q3 | **DELEGATE** | Urgent, **not** Important | Assign-out (note who) |
| Q4 | **DELETE** | Neither | Delete or batch-archive |

Visual layout (top-left to bottom-right): **DO → SCHEDULE / DELEGATE → DELETE**. The vertical axis is *Importance*, the horizontal is *Urgency*.

---

# Part 2 — Technical Architecture (the *How*)

## 2.1 Stack Decision (and why)

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript (strict)** | Server components for fast first paint, edge-friendly, mature PWA tooling, hand-off familiarity |
| Styling | **Tailwind CSS v4 + shadcn/ui** | Antigravity has strong patterns for this; minimal custom CSS |
| Client state | **Zustand** | Tiny, no Provider hell, plays well with persistence middleware |
| Server state / cache | **TanStack Query v5** | Built-in optimistic updates and request dedup |
| Drag-and-drop | **dnd-kit** | Accessible (keyboard + screen reader), modern, no react-dnd legacy |
| Local persistence | **Dexie.js (IndexedDB)** | Reliable offline cache; queryable; survives PWA reloads |
| Auth + DB + Realtime | **Supabase** (Postgres + RLS + Realtime + Auth) | One-vendor for auth, sync, and storage; free tier covers v1 |
| Service worker | **Serwist** (next-pwa successor) | Modern Workbox successor, App Router compatible |
| Icons | **lucide-react** | Tree-shakeable, consistent |
| Forms / validation | **react-hook-form + Zod** | Same Zod schema reused server-side |
| Tests | **Vitest** (unit) + **Playwright** (e2e, incl. PWA install + offline) | Antigravity can run Playwright in its built-in browser |
| Linting | **ESLint + Prettier + TypeScript strict** | Enforced via `AGENTS.md` |
| Deploy | **Vercel** (frontend) + **Supabase** (backend) | Both free-tier friendly; auto-deploy on `main` |

## 2.2 Data Model (Postgres / Supabase)

```sql
-- Profiles (1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  theme text default 'system' check (theme in ('light','dark','system')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- The core entity
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (length(title) between 1 and 280),
  notes text,
  quadrant text not null check (quadrant in ('do','schedule','delegate','delete')),
  status text not null default 'open' check (status in ('open','done','archived')),
  due_at timestamptz,
  delegated_to text,
  tags text[] default '{}',
  position double precision not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  completed_at timestamptz,
  deleted_at timestamptz
);
```

## 2.3 Sync Architecture

**Strategy: Local-first with optimistic mutations + Supabase Realtime as the truth-broadcaster.**

## 2.4 PWA Requirements

- `manifest.webmanifest` with `display: standalone`, `start_url: /`
- Service worker via Serwist

## 2.5 Accessibility (non-negotiable)

- WCAG 2.1 **AA** baseline

## 2.6 Performance Budgets

- **First Contentful Paint** ≤ 1.5s
- **Lighthouse Performance** ≥ 90

## 2.7 Security

- Supabase Row Level Security on every table
