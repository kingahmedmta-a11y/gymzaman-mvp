-- Gym Zaman security policies for Supabase / Postgres
-- Run this in Supabase SQL Editor after confirming the table and column names match your project.
-- هدف الملف: المدرب يشوف بياناته فقط، الهيد/السينيور يشوف فرعه فقط، والديركتور/الأونر يشوف الكل.

create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.current_profile_branch_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select branch_id from public.profiles where id = auth.uid();
$$;

create or replace function public.is_global_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role() in ('owner','fitness_director'), false);
$$;

create or replace function public.is_branch_leader()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role() in ('head_coach','senior'), false);
$$;

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.trainer_daily_logs enable row level security;
alter table public.attendance_logs enable row level security;
alter table public.pt_programs enable row level security;
alter table public.trainer_evaluations enable row level security;
alter table public.senior_daily_reports enable row level security;
alter table public.head_coach_daily_reports enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles
create policy "profiles_select_by_role" on public.profiles
for select using (
  id = auth.uid()
  or public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
);

create policy "profiles_update_by_admin" on public.profiles
for update using (public.is_global_admin())
with check (public.is_global_admin());

-- Clients
create policy "clients_select_by_role" on public.clients
for select using (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
  or assigned_trainer_id = auth.uid()
  or created_by = auth.uid()
);

create policy "clients_insert_by_staff" on public.clients
for insert with check (
  public.is_global_admin()
  or (created_by = auth.uid() and branch_id = public.current_profile_branch_id())
  or (assigned_trainer_id = auth.uid() and branch_id = public.current_profile_branch_id())
);

create policy "clients_update_by_role" on public.clients
for update using (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
  or assigned_trainer_id = auth.uid()
)
with check (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
  or assigned_trainer_id = auth.uid()
);

-- Daily logs, attendance, PT programs: same rule pattern
create policy "daily_logs_select_by_role" on public.trainer_daily_logs
for select using (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
  or trainer_id = auth.uid()
);
create policy "daily_logs_insert_own" on public.trainer_daily_logs
for insert with check (trainer_id = auth.uid() and branch_id = public.current_profile_branch_id());
create policy "daily_logs_update_admin" on public.trainer_daily_logs
for update using (public.is_global_admin()) with check (public.is_global_admin());
create policy "daily_logs_delete_admin" on public.trainer_daily_logs
for delete using (public.is_global_admin());

create policy "attendance_select_by_role" on public.attendance_logs
for select using (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
  or trainer_id = auth.uid()
);
create policy "attendance_insert_own" on public.attendance_logs
for insert with check (trainer_id = auth.uid() and branch_id = public.current_profile_branch_id());

create policy "pt_programs_select_by_role" on public.pt_programs
for select using (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
  or trainer_id = auth.uid()
  or created_by = auth.uid()
);
create policy "pt_programs_insert_own" on public.pt_programs
for insert with check (trainer_id = auth.uid() and branch_id = public.current_profile_branch_id());
create policy "pt_programs_update_admin" on public.pt_programs
for update using (public.is_global_admin()) with check (public.is_global_admin());
create policy "pt_programs_delete_admin" on public.pt_programs
for delete using (public.is_global_admin());

-- Evaluations: trainer can see own evaluation, branch leaders see their branch, director/owner see all.
create policy "evaluations_select_by_role" on public.trainer_evaluations
for select using (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
  or trainer_id = auth.uid()
);
create policy "evaluations_insert_leaders" on public.trainer_evaluations
for insert with check (
  public.is_global_admin()
  or (public.is_branch_leader() and evaluator_id = auth.uid() and branch_id = public.current_profile_branch_id())
);

-- Branch reports
create policy "senior_reports_select_by_role" on public.senior_daily_reports
for select using (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
  or senior_id = auth.uid()
);
create policy "senior_reports_insert_own" on public.senior_daily_reports
for insert with check (senior_id = auth.uid() and branch_id = public.current_profile_branch_id());

create policy "head_reports_select_by_role" on public.head_coach_daily_reports
for select using (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
  or head_coach_id = auth.uid()
);
create policy "head_reports_insert_own" on public.head_coach_daily_reports
for insert with check (head_coach_id = auth.uid() and branch_id = public.current_profile_branch_id());

-- Audit log: admin only reads all. Staff can insert their own action only.
create policy "audit_select_admin" on public.audit_logs
for select using (public.is_global_admin());
create policy "audit_insert_own" on public.audit_logs
for insert with check (actor_id = auth.uid());
