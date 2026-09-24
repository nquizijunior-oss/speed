-- Run this once in Supabase SQL Editor.
create table if not exists public.app_shared_edits (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now(),
  updated_by text
);

create or replace function public.set_app_shared_edits_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists app_shared_edits_updated_at on public.app_shared_edits;
create trigger app_shared_edits_updated_at
before update on public.app_shared_edits
for each row execute function public.set_app_shared_edits_updated_at();

alter table public.app_shared_edits enable row level security;

drop policy if exists "public can read shared edits" on public.app_shared_edits;
drop policy if exists "public can insert shared edits" on public.app_shared_edits;
drop policy if exists "public can update shared edits" on public.app_shared_edits;
drop policy if exists "public can delete shared edits" on public.app_shared_edits;

create policy "public can read shared edits"
on public.app_shared_edits for select to anon, authenticated using (true);

create policy "public can insert shared edits"
on public.app_shared_edits for insert to anon, authenticated with check (true);

create policy "public can update shared edits"
on public.app_shared_edits for update to anon, authenticated using (true) with check (true);

create policy "public can delete shared edits"
on public.app_shared_edits for delete to anon, authenticated using (true);

-- Enable realtime so open browsers can receive changes.
alter table public.app_shared_edits replica identity full;

begin;
  alter publication supabase_realtime add table public.app_shared_edits;
exception when duplicate_object then null;
end;
