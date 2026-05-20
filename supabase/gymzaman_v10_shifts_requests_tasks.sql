-- Gym Zaman v10: Shifts, attendance punch, coach requests, target plans, and trainer tasks
-- Run this in Supabase SQL Editor after deploying v10.

alter table public.profiles add column if not exists active boolean default true;
update public.profiles set active = true where active is null;

create or replace function public.is_management()
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
      and p.role in ('owner','fitness_director','admin')
  );
$$;
grant execute on function public.is_management() to authenticated;

create or replace function public.current_user_branch_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.branch_id from public.profiles p where p.id = auth.uid() limit 1;
$$;
grant execute on function public.current_user_branch_id() to authenticated;

create or replace function public.is_branch_leader_for(branch uuid)
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
      and p.role in ('head_coach','senior')
      and p.branch_id = branch
  );
$$;
grant execute on function public.is_branch_leader_for(uuid) to authenticated;

create table if not exists public.coach_shifts (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles(id) on delete cascade,
  branch_id uuid references public.branches(id),
  shift_date date not null,
  shift text default 'PM',
  expected_in time,
  expected_out time,
  is_off_day boolean default false,
  notes text,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(trainer_id, shift_date)
);

create table if not exists public.coach_requests (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles(id) on delete cascade,
  branch_id uuid references public.branches(id),
  request_type text not null check (request_type in ('late_permission','vacation','advance')),
  request_date date not null default current_date,
  requested_minutes integer default 0,
  amount numeric default 0,
  reason text,
  status text default 'pending' check (status in ('pending','approved','rejected')),
  manager_notes text,
  created_by uuid references public.profiles(id),
  decided_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  decided_at timestamptz
);

create table if not exists public.monthly_target_plans (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles(id) on delete cascade,
  branch_id uuid references public.branches(id),
  target_month text not null,
  monthly_target numeric default 0,
  current_achievement numeric default 0,
  action_plan text,
  expected_challenges text,
  support_needed text,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(trainer_id, target_month)
);

create table if not exists public.trainer_tasks (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles(id) on delete cascade,
  branch_id uuid references public.branches(id),
  task_title text not null,
  task_details text,
  due_date date,
  priority text default 'normal',
  status text default 'pending' check (status in ('pending','in_progress','done','cancelled')),
  assigned_by uuid references public.profiles(id),
  completed_by uuid references public.profiles(id),
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Attendance table support for punch-in/out if columns were missing
alter table public.attendance_logs add column if not exists expected_in time;
alter table public.attendance_logs add column if not exists expected_out time;
alter table public.attendance_logs add column if not exists late_minutes integer default 0;
alter table public.attendance_logs add column if not exists overtime_minutes integer default 0;
alter table public.attendance_logs add column if not exists notes text;
create unique index if not exists attendance_logs_trainer_date_unique on public.attendance_logs(trainer_id, attendance_date);

alter table public.coach_shifts enable row level security;
alter table public.coach_requests enable row level security;
alter table public.monthly_target_plans enable row level security;
alter table public.trainer_tasks enable row level security;
alter table public.attendance_logs enable row level security;

-- Coach shifts
drop policy if exists "coach_shifts_select_scoped" on public.coach_shifts;
create policy "coach_shifts_select_scoped" on public.coach_shifts
for select using (public.is_management() or trainer_id = auth.uid() or public.is_branch_leader_for(branch_id));
drop policy if exists "coach_shifts_write_management" on public.coach_shifts;
create policy "coach_shifts_write_management" on public.coach_shifts
for all using (public.is_management()) with check (public.is_management());

-- Coach requests
drop policy if exists "coach_requests_select_scoped" on public.coach_requests;
create policy "coach_requests_select_scoped" on public.coach_requests
for select using (public.is_management() or trainer_id = auth.uid() or public.is_branch_leader_for(branch_id));
drop policy if exists "coach_requests_insert_own" on public.coach_requests;
create policy "coach_requests_insert_own" on public.coach_requests
for insert with check (trainer_id = auth.uid() or public.is_management());
drop policy if exists "coach_requests_update_management" on public.coach_requests;
create policy "coach_requests_update_management" on public.coach_requests
for update using (public.is_management()) with check (public.is_management());
drop policy if exists "coach_requests_delete_management" on public.coach_requests;
create policy "coach_requests_delete_management" on public.coach_requests
for delete using (public.is_management());

-- Target plans
drop policy if exists "target_plans_select_scoped" on public.monthly_target_plans;
create policy "target_plans_select_scoped" on public.monthly_target_plans
for select using (public.is_management() or trainer_id = auth.uid() or public.is_branch_leader_for(branch_id));
drop policy if exists "target_plans_upsert_own" on public.monthly_target_plans;
create policy "target_plans_upsert_own" on public.monthly_target_plans
for insert with check (trainer_id = auth.uid() or public.is_management());
drop policy if exists "target_plans_update_own_or_management" on public.monthly_target_plans;
create policy "target_plans_update_own_or_management" on public.monthly_target_plans
for update using (trainer_id = auth.uid() or public.is_management()) with check (trainer_id = auth.uid() or public.is_management());
drop policy if exists "target_plans_delete_management" on public.monthly_target_plans;
create policy "target_plans_delete_management" on public.monthly_target_plans
for delete using (public.is_management());

-- Trainer tasks
drop policy if exists "trainer_tasks_select_scoped" on public.trainer_tasks;
create policy "trainer_tasks_select_scoped" on public.trainer_tasks
for select using (public.is_management() or trainer_id = auth.uid() or public.is_branch_leader_for(branch_id));
drop policy if exists "trainer_tasks_insert_management" on public.trainer_tasks;
create policy "trainer_tasks_insert_management" on public.trainer_tasks
for insert with check (public.is_management());
drop policy if exists "trainer_tasks_update_scoped" on public.trainer_tasks;
create policy "trainer_tasks_update_scoped" on public.trainer_tasks
for update using (public.is_management() or trainer_id = auth.uid()) with check (public.is_management() or trainer_id = auth.uid());
drop policy if exists "trainer_tasks_delete_management" on public.trainer_tasks;
create policy "trainer_tasks_delete_management" on public.trainer_tasks
for delete using (public.is_management());

-- Attendance punch policies
drop policy if exists "attendance_select_scoped_v10" on public.attendance_logs;
create policy "attendance_select_scoped_v10" on public.attendance_logs
for select using (public.is_management() or trainer_id = auth.uid() or public.is_branch_leader_for(branch_id));
drop policy if exists "attendance_insert_own_v10" on public.attendance_logs;
create policy "attendance_insert_own_v10" on public.attendance_logs
for insert with check (trainer_id = auth.uid() or public.is_management());
drop policy if exists "attendance_update_own_or_management_v10" on public.attendance_logs;
create policy "attendance_update_own_or_management_v10" on public.attendance_logs
for update using (trainer_id = auth.uid() or public.is_management()) with check (trainer_id = auth.uid() or public.is_management());
