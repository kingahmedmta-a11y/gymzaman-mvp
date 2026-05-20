-- Gym Zaman v8: Client Intake File + PAR-Q7 + Fitness Test
-- Run this once in Supabase SQL Editor before testing the new Add Client page.

alter table public.clients
  add column if not exists age integer,
  add column if not exists height_cm numeric,
  add column if not exists weight_kg numeric,
  add column if not exists emergency_contact text,
  add column if not exists medical_history text,
  add column if not exists current_pain text,
  add column if not exists medications text,
  add column if not exists parq7 jsonb default '{}'::jsonb,
  add column if not exists fitness_test jsonb default '{}'::jsonb;

-- Backfill null JSON fields to avoid display issues in the app.
update public.clients
set parq7 = '{}'::jsonb
where parq7 is null;

update public.clients
set fitness_test = '{}'::jsonb
where fitness_test is null;

-- Optional indexes for faster coach/client file filtering.
create index if not exists idx_clients_assigned_trainer_id on public.clients(assigned_trainer_id);
create index if not exists idx_clients_branch_id on public.clients(branch_id);
create index if not exists idx_pt_programs_client_id on public.pt_programs(client_id);
