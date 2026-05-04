-- Migration: Initial Schema
-- Author: Antigravity
-- Rollback: Drop tables profiles, tasks

begin;

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

-- Indexes
create index tasks_user_quadrant_idx on public.tasks (user_id, quadrant, position);
create index tasks_user_updated_idx on public.tasks (user_id, updated_at desc);

-- RLS
alter table public.tasks enable row level security;
create policy "tasks_owner_all" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.profiles enable row level security;
create policy "profiles_owner_all" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Triggers for updated_at
create or replace function public.set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger tasks_set_updated before update on public.tasks
  for each row execute function public.set_updated_at();

create trigger profiles_set_updated before update on public.profiles
  for each row execute function public.set_updated_at();

commit;
