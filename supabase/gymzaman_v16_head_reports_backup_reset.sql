-- =========================================================
-- Gym Zaman v16: Head Coach Reports + Branch Backup + New Month Reset
-- Run this once in Supabase SQL Editor after deploying v16.
-- =========================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------
-- Safety columns for existing tables
-- ---------------------------------------------------------
alter table public.profiles add column if not exists name text;
alter table public.profiles add column if not exists branch_name text;
alter table public.profiles add column if not exists active boolean default true;
alter table public.profiles add column if not exists status text default 'active';

update public.profiles set active = true where active is null;
update public.profiles set status = coalesce(status, 'active');
update public.profiles set name = coalesce(name, full_name, email) where name is null;
update public.profiles p set branch_name = coalesce(p.branch_name, b.name)
from public.branches b
where p.branch_id = b.id;

-- ---------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------
create or replace function public.is_global_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and coalesce(p.active, true) = true
      and coalesce(p.status, 'active') = 'active'
      and p.role in ('owner', 'admin', 'fitness_director')
  );
$$;
grant execute on function public.is_global_admin() to authenticated;

create or replace function public.is_branch_leader()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and coalesce(p.active, true) = true
      and coalesce(p.status, 'active') = 'active'
      and p.role in ('head_coach', 'senior', 'owner', 'admin', 'fitness_director')
  );
$$;
grant execute on function public.is_branch_leader() to authenticated;

create or replace function public.current_profile_branch_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.branch_id from public.profiles p where p.id = auth.uid() limit 1;
$$;
grant execute on function public.current_profile_branch_id() to authenticated;

-- ---------------------------------------------------------
-- 1) Head coach report about each trainer
-- ---------------------------------------------------------
create table if not exists public.head_coach_trainer_reports (
  id uuid primary key default gen_random_uuid(),
  head_coach_id uuid references public.profiles(id) on delete set null,
  trainer_id uuid references public.profiles(id) on delete cascade,
  branch_id uuid,
  report_date date default current_date,
  performance_score numeric default 0,
  commitment_score numeric default 0,
  service_score numeric default 0,
  issue text,
  action_required text,
  notes text,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.head_coach_trainer_reports add column if not exists head_coach_id uuid references public.profiles(id) on delete set null;
alter table public.head_coach_trainer_reports add column if not exists trainer_id uuid references public.profiles(id) on delete cascade;
alter table public.head_coach_trainer_reports add column if not exists branch_id uuid;
alter table public.head_coach_trainer_reports add column if not exists report_date date default current_date;
alter table public.head_coach_trainer_reports add column if not exists performance_score numeric default 0;
alter table public.head_coach_trainer_reports add column if not exists commitment_score numeric default 0;
alter table public.head_coach_trainer_reports add column if not exists service_score numeric default 0;
alter table public.head_coach_trainer_reports add column if not exists issue text;
alter table public.head_coach_trainer_reports add column if not exists action_required text;
alter table public.head_coach_trainer_reports add column if not exists notes text;
alter table public.head_coach_trainer_reports add column if not exists created_by uuid references public.profiles(id);
alter table public.head_coach_trainer_reports add column if not exists updated_by uuid references public.profiles(id);
alter table public.head_coach_trainer_reports add column if not exists created_at timestamptz default now();
alter table public.head_coach_trainer_reports add column if not exists updated_at timestamptz default now();

create or replace function public.before_save_head_coach_trainer_report()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare v_branch uuid;
begin
  new.updated_at := now();
  new.head_coach_id := coalesce(new.head_coach_id, auth.uid());
  new.created_by := coalesce(new.created_by, auth.uid());
  new.updated_by := coalesce(new.updated_by, auth.uid());
  select p.branch_id into v_branch from public.profiles p where p.id = new.trainer_id limit 1;
  new.branch_id := coalesce(new.branch_id, v_branch, public.current_profile_branch_id());
  return new;
end;
$$;

drop trigger if exists trg_before_save_head_coach_trainer_report on public.head_coach_trainer_reports;
create trigger trg_before_save_head_coach_trainer_report
before insert or update on public.head_coach_trainer_reports
for each row execute function public.before_save_head_coach_trainer_report();

alter table public.head_coach_trainer_reports enable row level security;
drop policy if exists "head_coach_trainer_reports_select" on public.head_coach_trainer_reports;
drop policy if exists "head_coach_trainer_reports_insert" on public.head_coach_trainer_reports;
drop policy if exists "head_coach_trainer_reports_update" on public.head_coach_trainer_reports;
drop policy if exists "head_coach_trainer_reports_delete" on public.head_coach_trainer_reports;

create policy "head_coach_trainer_reports_select"
on public.head_coach_trainer_reports for select
using (
  public.is_global_admin()
  or head_coach_id = auth.uid()
  or trainer_id = auth.uid()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
);

create policy "head_coach_trainer_reports_insert"
on public.head_coach_trainer_reports for insert
with check (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
);

create policy "head_coach_trainer_reports_update"
on public.head_coach_trainer_reports for update
using (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
)
with check (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
);

create policy "head_coach_trainer_reports_delete"
on public.head_coach_trainer_reports for delete
using (public.is_global_admin());

-- ---------------------------------------------------------
-- 2) Daily branch report by Head Coach
-- ---------------------------------------------------------
create table if not exists public.branch_daily_reports (
  id uuid primary key default gen_random_uuid(),
  head_coach_id uuid references public.profiles(id) on delete set null,
  branch_id uuid,
  report_date date default current_date,
  present_trainers integer default 0,
  absent_trainers integer default 0,
  branch_traffic text,
  main_issues text,
  actions_taken text,
  notes text,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.branch_daily_reports add column if not exists head_coach_id uuid references public.profiles(id) on delete set null;
alter table public.branch_daily_reports add column if not exists branch_id uuid;
alter table public.branch_daily_reports add column if not exists report_date date default current_date;
alter table public.branch_daily_reports add column if not exists present_trainers integer default 0;
alter table public.branch_daily_reports add column if not exists absent_trainers integer default 0;
alter table public.branch_daily_reports add column if not exists branch_traffic text;
alter table public.branch_daily_reports add column if not exists main_issues text;
alter table public.branch_daily_reports add column if not exists actions_taken text;
alter table public.branch_daily_reports add column if not exists notes text;
alter table public.branch_daily_reports add column if not exists created_by uuid references public.profiles(id);
alter table public.branch_daily_reports add column if not exists updated_by uuid references public.profiles(id);
alter table public.branch_daily_reports add column if not exists created_at timestamptz default now();
alter table public.branch_daily_reports add column if not exists updated_at timestamptz default now();

create or replace function public.before_save_branch_daily_report()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at := now();
  new.head_coach_id := coalesce(new.head_coach_id, auth.uid());
  new.created_by := coalesce(new.created_by, auth.uid());
  new.updated_by := coalesce(new.updated_by, auth.uid());
  new.branch_id := coalesce(new.branch_id, public.current_profile_branch_id());
  return new;
end;
$$;

drop trigger if exists trg_before_save_branch_daily_report on public.branch_daily_reports;
create trigger trg_before_save_branch_daily_report
before insert or update on public.branch_daily_reports
for each row execute function public.before_save_branch_daily_report();

alter table public.branch_daily_reports enable row level security;
drop policy if exists "branch_daily_reports_select" on public.branch_daily_reports;
drop policy if exists "branch_daily_reports_insert" on public.branch_daily_reports;
drop policy if exists "branch_daily_reports_update" on public.branch_daily_reports;
drop policy if exists "branch_daily_reports_delete" on public.branch_daily_reports;

create policy "branch_daily_reports_select"
on public.branch_daily_reports for select
using (
  public.is_global_admin()
  or head_coach_id = auth.uid()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
);

create policy "branch_daily_reports_insert"
on public.branch_daily_reports for insert
with check (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
);

create policy "branch_daily_reports_update"
on public.branch_daily_reports for update
using (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
)
with check (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
);

create policy "branch_daily_reports_delete"
on public.branch_daily_reports for delete
using (public.is_global_admin());

-- ---------------------------------------------------------
-- 3) Ensure reset-related tables have branch_id where possible
-- ---------------------------------------------------------
do $$
begin
  if to_regclass('public.trainer_daily_logs') is not null then
    alter table public.trainer_daily_logs add column if not exists branch_id uuid;
  end if;
  if to_regclass('public.attendance_logs') is not null then
    alter table public.attendance_logs add column if not exists branch_id uuid;
  end if;
  if to_regclass('public.pt_programs') is not null then
    alter table public.pt_programs add column if not exists branch_id uuid;
  end if;
  if to_regclass('public.clients') is not null then
    alter table public.clients add column if not exists branch_id uuid;
  end if;
  if to_regclass('public.senior_daily_reports') is not null then
    alter table public.senior_daily_reports add column if not exists branch_id uuid;
  end if;
  if to_regclass('public.head_coach_daily_reports') is not null then
    alter table public.head_coach_daily_reports add column if not exists branch_id uuid;
  end if;
  if to_regclass('public.trainer_evaluations') is not null then
    alter table public.trainer_evaluations add column if not exists branch_id uuid;
  end if;
  if to_regclass('public.reception_logs') is not null then
    alter table public.reception_logs add column if not exists branch_id uuid;
  end if;
  if to_regclass('public.sales_leads') is not null then
    alter table public.sales_leads add column if not exists branch_id uuid;
  end if;
end $$;

-- ---------------------------------------------------------
-- 4) Reset operational data RPC
-- Keeps branches, profiles, and fixed shift planner by default.
-- p_include_clients=true also removes clients and PT programs.
-- ---------------------------------------------------------
create or replace function public.gymzaman_reset_operational_data(
  p_branch_id uuid default null,
  p_include_clients boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_is_admin boolean;
  v_deleted jsonb := '{}'::jsonb;
begin
  select public.is_global_admin() into v_is_admin;
  if not coalesce(v_is_admin, false) then
    raise exception 'Not allowed';
  end if;

  if p_branch_id is null then
    delete from public.attendance_logs;
    v_deleted := v_deleted || jsonb_build_object('attendance_logs', true);
    delete from public.attendance_punches;
    v_deleted := v_deleted || jsonb_build_object('attendance_punches', true);
    delete from public.trainer_daily_logs;
    v_deleted := v_deleted || jsonb_build_object('trainer_daily_logs', true);
    delete from public.coach_requests;
    v_deleted := v_deleted || jsonb_build_object('coach_requests', true);
    delete from public.trainer_tasks;
    v_deleted := v_deleted || jsonb_build_object('trainer_tasks', true);
    delete from public.monthly_target_plans;
    v_deleted := v_deleted || jsonb_build_object('monthly_target_plans', true);
    delete from public.senior_daily_reports;
    v_deleted := v_deleted || jsonb_build_object('senior_daily_reports', true);
    delete from public.head_coach_daily_reports;
    v_deleted := v_deleted || jsonb_build_object('head_coach_daily_reports', true);
    delete from public.head_coach_trainer_reports;
    v_deleted := v_deleted || jsonb_build_object('head_coach_trainer_reports', true);
    delete from public.branch_daily_reports;
    v_deleted := v_deleted || jsonb_build_object('branch_daily_reports', true);
    delete from public.trainer_evaluations;
    v_deleted := v_deleted || jsonb_build_object('trainer_evaluations', true);
    delete from public.reception_logs;
    v_deleted := v_deleted || jsonb_build_object('reception_logs', true);
    delete from public.sales_leads;
    v_deleted := v_deleted || jsonb_build_object('sales_leads', true);
    if p_include_clients then
      delete from public.pt_programs;
      delete from public.clients;
      v_deleted := v_deleted || jsonb_build_object('clients_and_programs', true);
    end if;
  else
    delete from public.attendance_logs where branch_id = p_branch_id;
    delete from public.attendance_punches where branch_id = p_branch_id;
    delete from public.trainer_daily_logs where branch_id = p_branch_id;
    delete from public.coach_requests where branch_id = p_branch_id;
    delete from public.trainer_tasks where branch_id = p_branch_id;
    delete from public.monthly_target_plans where branch_id = p_branch_id;
    delete from public.senior_daily_reports where branch_id = p_branch_id;
    delete from public.head_coach_daily_reports where branch_id = p_branch_id;
    delete from public.head_coach_trainer_reports where branch_id = p_branch_id;
    delete from public.branch_daily_reports where branch_id = p_branch_id;
    delete from public.trainer_evaluations where branch_id = p_branch_id;
    delete from public.reception_logs where branch_id = p_branch_id;
    delete from public.sales_leads where branch_id = p_branch_id;
    if p_include_clients then
      delete from public.pt_programs where branch_id = p_branch_id;
      delete from public.clients where branch_id = p_branch_id;
    end if;
    v_deleted := jsonb_build_object('branch_id', p_branch_id, 'include_clients', p_include_clients);
  end if;

  notify pgrst, 'reload schema';
  return jsonb_build_object('ok', true, 'reset_at', now(), 'details', v_deleted);
end;
$$;

grant execute on function public.gymzaman_reset_operational_data(uuid, boolean) to authenticated;

-- Refresh Supabase schema cache
notify pgrst, 'reload schema';

select 'GYM_ZAMAN_V16_HEAD_REPORTS_BACKUP_RESET_READY' as status, now() as finished_at;
