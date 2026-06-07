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
