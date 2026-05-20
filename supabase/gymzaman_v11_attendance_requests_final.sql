-- =========================================================
-- Gym Zaman v11 Final Attendance / Requests / Shifts Fix
-- Run once in Supabase SQL Editor after deploying v11.
-- =========================================================

-- ---------- Profiles safety ----------
alter table public.profiles add column if not exists name text;
alter table public.profiles add column if not exists branch_name text;
alter table public.profiles add column if not exists active boolean default true;
update public.profiles set active = true where active is null;
update public.profiles set name = coalesce(name, full_name, email) where name is null;

-- ---------- Helper functions ----------
create or replace function public.is_control_admin()
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
grant execute on function public.is_control_admin() to authenticated;

create or replace function public.is_global_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_control_admin();
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

-- ---------- Coach shifts ----------
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
alter table public.coach_shifts add column if not exists is_off_day boolean default false;
alter table public.coach_shifts add column if not exists day_off boolean default false;
alter table public.coach_shifts add column if not exists notes text;
alter table public.coach_shifts add column if not exists created_by uuid references public.profiles(id);
alter table public.coach_shifts add column if not exists updated_by uuid references public.profiles(id);
alter table public.coach_shifts add column if not exists created_at timestamptz default now();
alter table public.coach_shifts add column if not exists updated_at timestamptz default now();
update public.coach_shifts set coach_id = coalesce(coach_id, trainer_id), trainer_id = coalesce(trainer_id, coach_id), shift = coalesce(shift, shift_name), expected_in = coalesce(expected_in, start_time), expected_out = coalesce(expected_out, end_time), is_off_day = coalesce(is_off_day, day_off, false), day_off = coalesce(day_off, is_off_day, false);
delete from public.coach_shifts a using public.coach_shifts b where a.ctid < b.ctid and a.trainer_id = b.trainer_id and a.shift_date = b.shift_date;
create unique index if not exists coach_shifts_trainer_date_unique on public.coach_shifts(trainer_id, shift_date) where trainer_id is not null and shift_date is not null;
alter table public.coach_shifts enable row level security;
drop policy if exists "coach_shifts_select" on public.coach_shifts;
drop policy if exists "coach_shifts_insert" on public.coach_shifts;
drop policy if exists "coach_shifts_update" on public.coach_shifts;
drop policy if exists "coach_shifts_delete" on public.coach_shifts;
create policy "coach_shifts_select" on public.coach_shifts for select using (trainer_id = auth.uid() or coach_id = auth.uid() or public.is_control_admin() or public.is_branch_leader());
create policy "coach_shifts_insert" on public.coach_shifts for insert with check (public.is_control_admin());
create policy "coach_shifts_update" on public.coach_shifts for update using (public.is_control_admin()) with check (public.is_control_admin());
create policy "coach_shifts_delete" on public.coach_shifts for delete using (public.is_control_admin());

-- ---------- Attendance logs automatic calculation ----------
alter table public.attendance_logs add column if not exists trainer_id uuid references public.profiles(id) on delete cascade;
alter table public.attendance_logs add column if not exists branch_id uuid;
alter table public.attendance_logs add column if not exists attendance_date date default current_date;
alter table public.attendance_logs add column if not exists shift text;
alter table public.attendance_logs add column if not exists expected_in time;
alter table public.attendance_logs add column if not exists expected_out time;
alter table public.attendance_logs add column if not exists check_in time;
alter table public.attendance_logs add column if not exists check_out time;
alter table public.attendance_logs add column if not exists late_minutes integer default 0;
alter table public.attendance_logs add column if not exists overtime_minutes integer default 0;
alter table public.attendance_logs add column if not exists notes text;
alter table public.attendance_logs add column if not exists created_at timestamptz default now();
alter table public.attendance_logs add column if not exists updated_at timestamptz default now();
delete from public.attendance_logs a using public.attendance_logs b where a.ctid < b.ctid and a.trainer_id = b.trainer_id and a.attendance_date = b.attendance_date;
create unique index if not exists attendance_logs_trainer_date_unique on public.attendance_logs(trainer_id, attendance_date) where trainer_id is not null and attendance_date is not null;

create or replace function public.recalculate_attendance_minutes()
returns trigger
language plpgsql
as $$
declare
  in_min integer;
  out_min integer;
  exp_in_min integer;
  exp_out_min integer;
begin
  if new.check_in is not null and new.expected_in is not null then
    in_min := extract(hour from new.check_in)::int * 60 + extract(minute from new.check_in)::int;
    exp_in_min := extract(hour from new.expected_in)::int * 60 + extract(minute from new.expected_in)::int;
    new.late_minutes := greatest(0, in_min - exp_in_min);
  else
    new.late_minutes := coalesce(new.late_minutes, 0);
  end if;
  if new.check_out is not null and new.expected_out is not null then
    out_min := extract(hour from new.check_out)::int * 60 + extract(minute from new.check_out)::int;
    exp_out_min := extract(hour from new.expected_out)::int * 60 + extract(minute from new.expected_out)::int;
    new.overtime_minutes := greatest(0, out_min - exp_out_min);
  else
    new.overtime_minutes := coalesce(new.overtime_minutes, 0);
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_recalculate_attendance_minutes on public.attendance_logs;
create trigger trg_recalculate_attendance_minutes
before insert or update on public.attendance_logs
for each row execute function public.recalculate_attendance_minutes();

alter table public.attendance_logs enable row level security;
drop policy if exists "attendance_logs_select_v11" on public.attendance_logs;
drop policy if exists "attendance_logs_insert_v11" on public.attendance_logs;
drop policy if exists "attendance_logs_update_v11" on public.attendance_logs;
drop policy if exists "attendance_logs_delete_v11" on public.attendance_logs;
create policy "attendance_logs_select_v11" on public.attendance_logs for select using (trainer_id = auth.uid() or public.is_control_admin() or public.is_branch_leader());
create policy "attendance_logs_insert_v11" on public.attendance_logs for insert with check (trainer_id = auth.uid() or public.is_control_admin());
create policy "attendance_logs_update_v11" on public.attendance_logs for update using (trainer_id = auth.uid() or public.is_control_admin()) with check (trainer_id = auth.uid() or public.is_control_admin());
create policy "attendance_logs_delete_v11" on public.attendance_logs for delete using (public.is_control_admin());

-- ---------- Coach requests approval workflow ----------
create table if not exists public.coach_requests (
  id uuid primary key default gen_random_uuid()
);
alter table public.coach_requests add column if not exists coach_id uuid references public.profiles(id) on delete cascade;
alter table public.coach_requests add column if not exists trainer_id uuid references public.profiles(id) on delete cascade;
alter table public.coach_requests add column if not exists requested_by uuid references public.profiles(id) on delete cascade;
alter table public.coach_requests add column if not exists branch_id uuid;
alter table public.coach_requests add column if not exists request_type text default 'late_permission';
alter table public.coach_requests add column if not exists request_title text;
alter table public.coach_requests add column if not exists reason text;
alter table public.coach_requests add column if not exists notes text;
alter table public.coach_requests add column if not exists request_date date default current_date;
alter table public.coach_requests add column if not exists start_date date;
alter table public.coach_requests add column if not exists end_date date;
alter table public.coach_requests add column if not exists from_time time;
alter table public.coach_requests add column if not exists to_time time;
alter table public.coach_requests add column if not exists requested_minutes integer default 0;
alter table public.coach_requests add column if not exists amount numeric default 0;
alter table public.coach_requests add column if not exists status text default 'pending';
alter table public.coach_requests add column if not exists admin_note text;
alter table public.coach_requests add column if not exists reviewed_by uuid references public.profiles(id);
alter table public.coach_requests add column if not exists reviewed_at timestamptz;
alter table public.coach_requests add column if not exists approved_by uuid references public.profiles(id);
alter table public.coach_requests add column if not exists approved_at timestamptz;
alter table public.coach_requests add column if not exists created_by uuid references public.profiles(id);
alter table public.coach_requests add column if not exists created_at timestamptz default now();
alter table public.coach_requests add column if not exists updated_at timestamptz default now();
update public.coach_requests set trainer_id = coalesce(trainer_id, coach_id, requested_by, created_by), coach_id = coalesce(coach_id, trainer_id, requested_by, created_by), requested_by = coalesce(requested_by, trainer_id, coach_id, created_by), created_by = coalesce(created_by, requested_by, trainer_id, coach_id), status = coalesce(status, 'pending');
alter table public.coach_requests enable row level security;
drop policy if exists "coach_requests_select" on public.coach_requests;
drop policy if exists "coach_requests_insert" on public.coach_requests;
drop policy if exists "coach_requests_update" on public.coach_requests;
drop policy if exists "coach_requests_delete" on public.coach_requests;
create policy "coach_requests_select" on public.coach_requests for select using (trainer_id = auth.uid() or coach_id = auth.uid() or requested_by = auth.uid() or public.is_control_admin() or public.is_branch_leader());
create policy "coach_requests_insert" on public.coach_requests for insert with check (trainer_id = auth.uid() or coach_id = auth.uid() or requested_by = auth.uid() or public.is_control_admin());
create policy "coach_requests_update" on public.coach_requests for update using (trainer_id = auth.uid() or coach_id = auth.uid() or requested_by = auth.uid() or public.is_control_admin()) with check (trainer_id = auth.uid() or coach_id = auth.uid() or requested_by = auth.uid() or public.is_control_admin());
create policy "coach_requests_delete" on public.coach_requests for delete using (public.is_control_admin());

-- ---------- Monthly target plans safe columns ----------
create table if not exists public.monthly_target_plans (id uuid primary key default gen_random_uuid());
alter table public.monthly_target_plans add column if not exists trainer_id uuid references public.profiles(id) on delete cascade;
alter table public.monthly_target_plans add column if not exists coach_id uuid references public.profiles(id) on delete cascade;
alter table public.monthly_target_plans add column if not exists branch_id uuid;
alter table public.monthly_target_plans add column if not exists target_month date default date_trunc('month', now())::date;
alter table public.monthly_target_plans add column if not exists monthly_target numeric default 0;
alter table public.monthly_target_plans add column if not exists current_achievement numeric default 0;
alter table public.monthly_target_plans add column if not exists action_plan text;
alter table public.monthly_target_plans add column if not exists expected_challenges text;
alter table public.monthly_target_plans add column if not exists support_needed text;
alter table public.monthly_target_plans add column if not exists created_by uuid references public.profiles(id);
alter table public.monthly_target_plans add column if not exists updated_by uuid references public.profiles(id);
alter table public.monthly_target_plans add column if not exists created_at timestamptz default now();
alter table public.monthly_target_plans add column if not exists updated_at timestamptz default now();
delete from public.monthly_target_plans a using public.monthly_target_plans b where a.ctid < b.ctid and a.trainer_id = b.trainer_id and a.target_month = b.target_month;
create unique index if not exists monthly_target_plans_trainer_month_unique on public.monthly_target_plans(trainer_id, target_month) where trainer_id is not null and target_month is not null;

-- ---------- Trainer tasks safe columns ----------
create table if not exists public.trainer_tasks (id uuid primary key default gen_random_uuid());
alter table public.trainer_tasks add column if not exists trainer_id uuid references public.profiles(id) on delete cascade;
alter table public.trainer_tasks add column if not exists coach_id uuid references public.profiles(id) on delete cascade;
alter table public.trainer_tasks add column if not exists assigned_by uuid references public.profiles(id);
alter table public.trainer_tasks add column if not exists branch_id uuid;
alter table public.trainer_tasks add column if not exists title text;
alter table public.trainer_tasks add column if not exists description text;
alter table public.trainer_tasks add column if not exists task_title text;
alter table public.trainer_tasks add column if not exists task_details text;
alter table public.trainer_tasks add column if not exists priority text default 'normal';
alter table public.trainer_tasks add column if not exists status text default 'pending';
alter table public.trainer_tasks add column if not exists due_date date;
alter table public.trainer_tasks add column if not exists completed_at timestamptz;
alter table public.trainer_tasks add column if not exists completed_by uuid references public.profiles(id);
alter table public.trainer_tasks add column if not exists created_at timestamptz default now();
alter table public.trainer_tasks add column if not exists updated_at timestamptz default now();
do $$ begin
  begin
    alter table public.trainer_tasks alter column title drop not null;
  exception when others then null;
  end;
end $$;
update public.trainer_tasks set title = coalesce(title, task_title), description = coalesce(description, task_details), task_title = coalesce(task_title, title), task_details = coalesce(task_details, description);
alter table public.trainer_tasks enable row level security;
drop policy if exists "trainer_tasks_select" on public.trainer_tasks;
drop policy if exists "trainer_tasks_insert" on public.trainer_tasks;
drop policy if exists "trainer_tasks_update" on public.trainer_tasks;
drop policy if exists "trainer_tasks_delete" on public.trainer_tasks;
create policy "trainer_tasks_select" on public.trainer_tasks for select using (trainer_id = auth.uid() or coach_id = auth.uid() or public.is_control_admin() or public.is_branch_leader());
create policy "trainer_tasks_insert" on public.trainer_tasks for insert with check (public.is_control_admin());
create policy "trainer_tasks_update" on public.trainer_tasks for update using (trainer_id = auth.uid() or public.is_control_admin()) with check (trainer_id = auth.uid() or public.is_control_admin());
create policy "trainer_tasks_delete" on public.trainer_tasks for delete using (public.is_control_admin());
