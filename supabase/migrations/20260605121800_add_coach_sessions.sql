-- Migration: Add Coach Sessions
-- Author: Antigravity
-- Rollback: drop table public.coach_sessions;

begin;

create table if not exists public.coach_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.coach_sessions enable row level security;

create policy "Users can only access their own sessions"
  on public.coach_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger coach_sessions_set_updated before update on public.coach_sessions
  for each row execute function public.set_updated_at();

commit;
