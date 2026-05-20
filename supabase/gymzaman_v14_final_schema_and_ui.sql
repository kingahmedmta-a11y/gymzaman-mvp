-- =========================================================
-- Gym Zaman v14 Final Schema Fix
-- Fixed weekly shifts, coach files, clients visibility, requests/tasks/attendance.
-- Run this once in Supabase SQL Editor after deploying v14.
-- =========================================================

-- ---------- Helper functions ----------
create or replace function public.is_global_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and coalesce(p.active, true) = true
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
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and coalesce(p.active, true) = true
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
  select p.branch_id
  from public.profiles p
  where p.id = auth.uid()
  limit 1;
$$;

grant execute on function public.current_profile_branch_id() to authenticated;

-- ---------- Profiles compatibility ----------
alter table public.profiles add column if not exists name text;
alter table public.profiles add column if not exists branch_name text;
alter table public.profiles add column if not exists active boolean default true;
alter table public.profiles add column if not exists status text default 'active';

update public.profiles set active = true where active is null;
update public.profiles set status = 'active' where status is null;
update public.profiles set name = coalesce(name, full_name, email) where name is null;

update public.profiles p
set branch_name = coalesce(p.branch_name, b.name)
from public.branches b
where p.branch_id = b.id;

-- ---------- Coach shifts: final fixed weekly schedule schema ----------
create table if not exists public.coach_shifts (
  id uuid primary key default gen_random_uuid()
);

alter table public.coach_shifts add column if not exists trainer_id uuid references public.profiles(id) on delete cascade;
alter table public.coach_shifts add column if not exists coach_id uuid references public.profiles(id) on delete cascade;
alter table public.coach_shifts add column if not exists branch_id uuid;
alter table public.coach_shifts add column if not exists shift_date date;
alter table public.coach_shifts add column if not exists shift text;
alter table public.coach_shifts add column if not exists shift_name text;
alter table public.coach_shifts add column if not exists expected_in time;
alter table public.coach_shifts add column if not exists expected_out time;
alter table public.coach_shifts add column if not exists start_time time;
alter table public.coach_shifts add column if not exists end_time time;
alter table public.coach_shifts add column if not exists shift_start time;
alter table public.coach_shifts add column if not exists shift_end time;
alter table public.coach_shifts add column if not exists official_in time;
alter table public.coach_shifts add column if not exists official_out time;
alter table public.coach_shifts add column if not exists weekly_day_off text;
alter table public.coach_shifts add column if not exists off_day_weekday text;
alter table public.coach_shifts add column if not exists day_off_weekday text;
alter table public.coach_shifts add column if not exists applies_weekly boolean default true;
alter table public.coach_shifts add column if not exists repeat_weekly boolean default true;
alter table public.coach_shifts add column if not exists is_off_day boolean default false;
alter table public.coach_shifts add column if not exists is_day_off boolean default false;
alter table public.coach_shifts add column if not exists day_off boolean default false;
alter table public.coach_shifts add column if not exists notes text;
alter table public.coach_shifts add column if not exists created_by uuid references public.profiles(id);
alter table public.coach_shifts add column if not exists updated_by uuid references public.profiles(id);
alter table public.coach_shifts add column if not exists created_at timestamptz default now();
alter table public.coach_shifts add column if not exists updated_at timestamptz default now();

update public.coach_shifts
set
  coach_id = coalesce(coach_id, trainer_id),
  trainer_id = coalesce(trainer_id, coach_id),
  shift = coalesce(shift, shift_name),
  shift_name = coalesce(shift_name, shift),
  expected_in = coalesce(expected_in, start_time, shift_start, official_in),
  expected_out = coalesce(expected_out, end_time, shift_end, official_out),
  start_time = coalesce(start_time, expected_in, shift_start, official_in),
  end_time = coalesce(end_time, expected_out, shift_end, official_out),
  shift_start = coalesce(shift_start, expected_in, start_time, official_in),
  shift_end = coalesce(shift_end, expected_out, end_time, official_out),
  official_in = coalesce(official_in, expected_in, start_time, shift_start),
  official_out = coalesce(official_out, expected_out, end_time, shift_end),
  off_day_weekday = coalesce(off_day_weekday, day_off_weekday, weekly_day_off),
  day_off_weekday = coalesce(day_off_weekday, off_day_weekday, weekly_day_off),
  weekly_day_off = coalesce(weekly_day_off, off_day_weekday, day_off_weekday),
  is_off_day = coalesce(is_off_day, false),
  is_day_off = coalesce(is_day_off, is_off_day, day_off, false),
  day_off = coalesce(day_off, is_off_day, is_day_off, false),
  applies_weekly = coalesce(applies_weekly, true),
  repeat_weekly = coalesce(repeat_weekly, applies_weekly, true),
  updated_at = now()
where true;

alter table public.coach_shifts enable row level security;
drop policy if exists "coach_shifts_select" on public.coach_shifts;
drop policy if exists "coach_shifts_insert" on public.coach_shifts;
drop policy if exists "coach_shifts_update" on public.coach_shifts;
drop policy if exists "coach_shifts_delete" on public.coach_shifts;

create policy "coach_shifts_select" on public.coach_shifts for select using (
  trainer_id = auth.uid() or coach_id = auth.uid() or public.is_global_admin() or public.is_branch_leader()
);
create policy "coach_shifts_insert" on public.coach_shifts for insert with check (
  public.is_global_admin() or public.is_branch_leader()
);
create policy "coach_shifts_update" on public.coach_shifts for update using (
  public.is_global_admin() or public.is_branch_leader()
) with check (
  public.is_global_admin() or public.is_branch_leader()
);
create policy "coach_shifts_delete" on public.coach_shifts for delete using (public.is_global_admin());

-- ---------- Attendance punches ----------
create table if not exists public.attendance_punches (id uuid primary key default gen_random_uuid());
alter table public.attendance_punches add column if not exists trainer_id uuid references public.profiles(id) on delete cascade;
alter table public.attendance_punches add column if not exists coach_id uuid references public.profiles(id) on delete cascade;
alter table public.attendance_punches add column if not exists branch_id uuid;
alter table public.attendance_punches add column if not exists work_date date default current_date;
alter table public.attendance_punches add column if not exists attendance_date date;
alter table public.attendance_punches add column if not exists check_in_at timestamptz;
alter table public.attendance_punches add column if not exists check_out_at timestamptz;
alter table public.attendance_punches add column if not exists check_in time;
alter table public.attendance_punches add column if not exists check_out time;
alter table public.attendance_punches add column if not exists expected_in time;
alter table public.attendance_punches add column if not exists expected_out time;
alter table public.attendance_punches add column if not exists scheduled_start time;
alter table public.attendance_punches add column if not exists scheduled_end time;
alter table public.attendance_punches add column if not exists late_minutes integer default 0;
alter table public.attendance_punches add column if not exists overtime_minutes integer default 0;
alter table public.attendance_punches add column if not exists permission_minutes integer default 0;
alter table public.attendance_punches add column if not exists status text default 'present';
alter table public.attendance_punches add column if not exists notes text;
alter table public.attendance_punches add column if not exists created_at timestamptz default now();
alter table public.attendance_punches add column if not exists updated_at timestamptz default now();

update public.attendance_punches
set attendance_date = coalesce(attendance_date, work_date),
    coach_id = coalesce(coach_id, trainer_id),
    trainer_id = coalesce(trainer_id, coach_id),
    expected_in = coalesce(expected_in, scheduled_start),
    expected_out = coalesce(expected_out, scheduled_end),
    scheduled_start = coalesce(scheduled_start, expected_in),
    scheduled_end = coalesce(scheduled_end, expected_out)
where true;

alter table public.attendance_punches enable row level security;
drop policy if exists "attendance_punches_select" on public.attendance_punches;
drop policy if exists "attendance_punches_insert" on public.attendance_punches;
drop policy if exists "attendance_punches_update" on public.attendance_punches;
drop policy if exists "attendance_punches_delete" on public.attendance_punches;
create policy "attendance_punches_select" on public.attendance_punches for select using (trainer_id = auth.uid() or coach_id = auth.uid() or public.is_global_admin() or public.is_branch_leader());
create policy "attendance_punches_insert" on public.attendance_punches for insert with check (trainer_id = auth.uid() or coach_id = auth.uid() or public.is_global_admin() or public.is_branch_leader());
create policy "attendance_punches_update" on public.attendance_punches for update using (trainer_id = auth.uid() or coach_id = auth.uid() or public.is_global_admin() or public.is_branch_leader()) with check (trainer_id = auth.uid() or coach_id = auth.uid() or public.is_global_admin() or public.is_branch_leader());
create policy "attendance_punches_delete" on public.attendance_punches for delete using (public.is_global_admin());

-- ---------- Coach requests ----------
create table if not exists public.coach_requests (id uuid primary key default gen_random_uuid());
alter table public.coach_requests add column if not exists coach_id uuid references public.profiles(id) on delete cascade;
alter table public.coach_requests add column if not exists trainer_id uuid references public.profiles(id) on delete cascade;
alter table public.coach_requests add column if not exists requested_by uuid references public.profiles(id) on delete cascade;
alter table public.coach_requests add column if not exists branch_id uuid;
alter table public.coach_requests add column if not exists request_type text default 'permission';
alter table public.coach_requests add column if not exists request_title text;
alter table public.coach_requests add column if not exists reason text;
alter table public.coach_requests add column if not exists notes text;
alter table public.coach_requests add column if not exists request_date date default current_date;
alter table public.coach_requests add column if not exists start_date date;
alter table public.coach_requests add column if not exists end_date date;
alter table public.coach_requests add column if not exists from_time time;
alter table public.coach_requests add column if not exists to_time time;
alter table public.coach_requests add column if not exists amount numeric default 0;
alter table public.coach_requests add column if not exists status text default 'pending';
alter table public.coach_requests add column if not exists admin_note text;
alter table public.coach_requests add column if not exists reviewed_by uuid references public.profiles(id);
alter table public.coach_requests add column if not exists reviewed_at timestamptz;
alter table public.coach_requests add column if not exists created_at timestamptz default now();
alter table public.coach_requests add column if not exists updated_at timestamptz default now();

update public.coach_requests set trainer_id = coalesce(trainer_id, coach_id, requested_by), coach_id = coalesce(coach_id, trainer_id, requested_by), requested_by = coalesce(requested_by, trainer_id, coach_id) where true;

alter table public.coach_requests enable row level security;
drop policy if exists "coach_requests_select" on public.coach_requests;
drop policy if exists "coach_requests_insert" on public.coach_requests;
drop policy if exists "coach_requests_update" on public.coach_requests;
drop policy if exists "coach_requests_delete" on public.coach_requests;
create policy "coach_requests_select" on public.coach_requests for select using (trainer_id = auth.uid() or coach_id = auth.uid() or requested_by = auth.uid() or public.is_global_admin() or public.is_branch_leader());
create policy "coach_requests_insert" on public.coach_requests for insert with check (trainer_id = auth.uid() or coach_id = auth.uid() or requested_by = auth.uid() or public.is_global_admin() or public.is_branch_leader());
create policy "coach_requests_update" on public.coach_requests for update using (trainer_id = auth.uid() or coach_id = auth.uid() or requested_by = auth.uid() or public.is_global_admin() or public.is_branch_leader()) with check (trainer_id = auth.uid() or coach_id = auth.uid() or requested_by = auth.uid() or public.is_global_admin() or public.is_branch_leader());
create policy "coach_requests_delete" on public.coach_requests for delete using (public.is_global_admin());

-- ---------- Trainer tasks ----------
create table if not exists public.trainer_tasks (id uuid primary key default gen_random_uuid());
alter table public.trainer_tasks add column if not exists trainer_id uuid references public.profiles(id) on delete cascade;
alter table public.trainer_tasks add column if not exists coach_id uuid references public.profiles(id) on delete cascade;
alter table public.trainer_tasks add column if not exists assigned_by uuid references public.profiles(id);
alter table public.trainer_tasks add column if not exists branch_id uuid;
alter table public.trainer_tasks add column if not exists title text;
alter table public.trainer_tasks add column if not exists description text;
alter table public.trainer_tasks add column if not exists priority text default 'medium';
alter table public.trainer_tasks add column if not exists status text default 'pending';
alter table public.trainer_tasks add column if not exists due_date date;
alter table public.trainer_tasks add column if not exists completed_at timestamptz;
alter table public.trainer_tasks add column if not exists created_at timestamptz default now();
alter table public.trainer_tasks add column if not exists updated_at timestamptz default now();
update public.trainer_tasks set coach_id = coalesce(coach_id, trainer_id), trainer_id = coalesce(trainer_id, coach_id) where true;
alter table public.trainer_tasks enable row level security;
drop policy if exists "trainer_tasks_select" on public.trainer_tasks;
drop policy if exists "trainer_tasks_insert" on public.trainer_tasks;
drop policy if exists "trainer_tasks_update" on public.trainer_tasks;
drop policy if exists "trainer_tasks_delete" on public.trainer_tasks;
create policy "trainer_tasks_select" on public.trainer_tasks for select using (trainer_id = auth.uid() or coach_id = auth.uid() or public.is_global_admin() or public.is_branch_leader());
create policy "trainer_tasks_insert" on public.trainer_tasks for insert with check (public.is_global_admin() or public.is_branch_leader());
create policy "trainer_tasks_update" on public.trainer_tasks for update using (trainer_id = auth.uid() or coach_id = auth.uid() or public.is_global_admin() or public.is_branch_leader()) with check (trainer_id = auth.uid() or coach_id = auth.uid() or public.is_global_admin() or public.is_branch_leader());
create policy "trainer_tasks_delete" on public.trainer_tasks for delete using (public.is_global_admin());

-- ---------- Monthly target plans ----------
create table if not exists public.monthly_target_plans (id uuid primary key default gen_random_uuid());
alter table public.monthly_target_plans add column if not exists trainer_id uuid references public.profiles(id) on delete cascade;
alter table public.monthly_target_plans add column if not exists coach_id uuid references public.profiles(id) on delete cascade;
alter table public.monthly_target_plans add column if not exists branch_id uuid;
alter table public.monthly_target_plans add column if not exists target_month date default date_trunc('month', now())::date;
alter table public.monthly_target_plans add column if not exists month date;
alter table public.monthly_target_plans add column if not exists target_amount numeric default 0;
alter table public.monthly_target_plans add column if not exists current_amount numeric default 0;
alter table public.monthly_target_plans add column if not exists plan_text text;
alter table public.monthly_target_plans add column if not exists action_steps text;
alter table public.monthly_target_plans add column if not exists expected_clients integer default 0;
alter table public.monthly_target_plans add column if not exists pt_sessions_target integer default 0;
alter table public.monthly_target_plans add column if not exists follow_up_plan text;
alter table public.monthly_target_plans add column if not exists obstacles text;
alter table public.monthly_target_plans add column if not exists support_needed text;
alter table public.monthly_target_plans add column if not exists status text default 'draft';
alter table public.monthly_target_plans add column if not exists created_at timestamptz default now();
alter table public.monthly_target_plans add column if not exists updated_at timestamptz default now();
update public.monthly_target_plans set target_month = coalesce(target_month, month, date_trunc('month', now())::date), coach_id = coalesce(coach_id, trainer_id), trainer_id = coalesce(trainer_id, coach_id) where true;
alter table public.monthly_target_plans enable row level security;
drop policy if exists "monthly_target_plans_select" on public.monthly_target_plans;
drop policy if exists "monthly_target_plans_insert" on public.monthly_target_plans;
drop policy if exists "monthly_target_plans_update" on public.monthly_target_plans;
drop policy if exists "monthly_target_plans_delete" on public.monthly_target_plans;
create policy "monthly_target_plans_select" on public.monthly_target_plans for select using (trainer_id = auth.uid() or coach_id = auth.uid() or public.is_global_admin() or public.is_branch_leader());
create policy "monthly_target_plans_insert" on public.monthly_target_plans for insert with check (trainer_id = auth.uid() or coach_id = auth.uid() or public.is_global_admin() or public.is_branch_leader());
create policy "monthly_target_plans_update" on public.monthly_target_plans for update using (trainer_id = auth.uid() or coach_id = auth.uid() or public.is_global_admin() or public.is_branch_leader()) with check (trainer_id = auth.uid() or coach_id = auth.uid() or public.is_global_admin() or public.is_branch_leader());
create policy "monthly_target_plans_delete" on public.monthly_target_plans for delete using (public.is_global_admin());

-- Ask PostgREST/Supabase API to reload schema cache.
notify pgrst, 'reload schema';
