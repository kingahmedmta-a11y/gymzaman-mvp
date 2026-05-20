-- =========================================================
-- Gym Zaman v12
-- Flexible shifts, weekly off-day selection, and trainer file support
-- Safe to run multiple times
-- =========================================================

-- Profiles columns used by the professional trainer files
alter table public.profiles add column if not exists name text;
alter table public.profiles add column if not exists branch_name text;
alter table public.profiles add column if not exists active boolean default true;

update public.profiles
set active = true
where active is null;

update public.profiles
set name = coalesce(name, full_name, email)
where name is null;

-- Coach shifts extra columns for flexible planning
create table if not exists public.coach_shifts (
  id uuid primary key default gen_random_uuid()
);

alter table public.coach_shifts add column if not exists coach_id uuid references public.profiles(id) on delete cascade;
alter table public.coach_shifts add column if not exists trainer_id uuid references public.profiles(id) on delete cascade;
alter table public.coach_shifts add column if not exists branch_id uuid;
alter table public.coach_shifts add column if not exists shift_date date;
alter table public.coach_shifts add column if not exists shift text;
alter table public.coach_shifts add column if not exists shift_name text;
alter table public.coach_shifts add column if not exists expected_in time;
alter table public.coach_shifts add column if not exists expected_out time;
alter table public.coach_shifts add column if not exists start_time time;
alter table public.coach_shifts add column if not exists end_time time;
alter table public.coach_shifts add column if not exists is_off_day boolean default false;
alter table public.coach_shifts add column if not exists day_off boolean default false;
alter table public.coach_shifts add column if not exists off_day_weekday text;
alter table public.coach_shifts add column if not exists applies_weekly boolean default false;
alter table public.coach_shifts add column if not exists notes text;
alter table public.coach_shifts add column if not exists created_by uuid references public.profiles(id);
alter table public.coach_shifts add column if not exists updated_by uuid references public.profiles(id);
alter table public.coach_shifts add column if not exists created_at timestamptz default now();
alter table public.coach_shifts add column if not exists updated_at timestamptz default now();

-- Keep old and new time columns in sync for existing rows
update public.coach_shifts
set
  shift_name = coalesce(shift_name, shift),
  shift = coalesce(shift, shift_name),
  start_time = coalesce(start_time, expected_in),
  end_time = coalesce(end_time, expected_out),
  expected_in = coalesce(expected_in, start_time),
  expected_out = coalesce(expected_out, end_time),
  day_off = coalesce(day_off, is_off_day, false),
  is_off_day = coalesce(is_off_day, day_off, false)
where true;

-- Helpful unique index for upsert by coach and date
create unique index if not exists coach_shifts_trainer_date_unique
on public.coach_shifts(trainer_id, shift_date)
where trainer_id is not null and shift_date is not null;

alter table public.coach_shifts enable row level security;

drop policy if exists "coach_shifts_select" on public.coach_shifts;
drop policy if exists "coach_shifts_insert" on public.coach_shifts;
drop policy if exists "coach_shifts_update" on public.coach_shifts;
drop policy if exists "coach_shifts_delete" on public.coach_shifts;

create policy "coach_shifts_select"
on public.coach_shifts
for select
using (
  trainer_id = auth.uid()
  or coach_id = auth.uid()
  or public.is_global_admin()
  or public.is_branch_leader()
);

create policy "coach_shifts_insert"
on public.coach_shifts
for insert
with check (
  public.is_global_admin()
  or public.is_branch_leader()
);

create policy "coach_shifts_update"
on public.coach_shifts
for update
using (
  public.is_global_admin()
  or public.is_branch_leader()
)
with check (
  public.is_global_admin()
  or public.is_branch_leader()
);

create policy "coach_shifts_delete"
on public.coach_shifts
for delete
using (public.is_global_admin());

-- Columns used by trainer file views across request/task/target tables
alter table public.coach_requests add column if not exists requested_minutes integer default 0;
alter table public.coach_requests add column if not exists approved_by uuid references public.profiles(id);
alter table public.coach_requests add column if not exists approved_at timestamptz;
alter table public.coach_requests add column if not exists created_by uuid references public.profiles(id);

alter table public.trainer_tasks add column if not exists task_title text;
alter table public.trainer_tasks add column if not exists task_details text;
alter table public.trainer_tasks add column if not exists completed_by uuid references public.profiles(id);

alter table public.monthly_target_plans add column if not exists monthly_target numeric default 0;
alter table public.monthly_target_plans add column if not exists current_achievement numeric default 0;
alter table public.monthly_target_plans add column if not exists action_plan text;
alter table public.monthly_target_plans add column if not exists expected_challenges text;

-- Keep alternate task/target column names synced if earlier versions created title/description/target_amount
update public.trainer_tasks
set
  task_title = coalesce(task_title, title),
  task_details = coalesce(task_details, description)
where true;

update public.monthly_target_plans
set
  monthly_target = coalesce(monthly_target, target_amount, 0),
  current_achievement = coalesce(current_achievement, current_amount, 0),
  action_plan = coalesce(action_plan, plan_text),
  expected_challenges = coalesce(expected_challenges, obstacles)
where true;
