-- Migration: Add Focus Modes
-- Author: Antigravity
-- Rollback: alter table public.tasks drop column modes; drop table public.user_preferences;

begin;

alter table public.tasks
  add column if not exists modes text[] not null default '{}';

create index if not exists idx_tasks_modes on public.tasks using gin (modes);

comment on column public.tasks.modes is 'Array of FocusMode IDs this task belongs to. Empty = untagged (shows in all modes).';

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  active_modes text[] not null default '{}',
  custom_modes jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_preferences enable row level security;

create policy "Users manage their own preferences"
  on public.user_preferences for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger user_preferences_set_updated before update on public.user_preferences
  for each row execute function public.set_updated_at();

commit;
