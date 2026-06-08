create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company_name text not null,
  job_title text not null,
  job_url text,
  salary text,
  location text,
  status text not null default 'saved',
  notes text,
  source text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.jobs enable row level security;

create policy "Users can view own jobs"
on public.jobs for select
using (auth.uid() = user_id);

create policy "Users can insert own jobs"
on public.jobs for insert
with check (auth.uid() = user_id);

create policy "Users can update own jobs"
on public.jobs for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own jobs"
on public.jobs for delete
using (auth.uid() = user_id);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_name text not null,
  properties jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

create index if not exists events_event_name_idx on public.events (event_name);
create index if not exists events_user_id_idx on public.events (user_id);
create index if not exists events_created_at_idx on public.events (created_at);

alter table public.events enable row level security;

create policy "Users can insert own events"
on public.events for insert
with check (user_id is null or auth.uid() = user_id);
