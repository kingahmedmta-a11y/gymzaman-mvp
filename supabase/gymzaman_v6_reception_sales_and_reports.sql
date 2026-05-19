-- Gym Zaman v6 update
-- Adds/repairs Reception + Sales tables, permits owner/director to delete reports,
-- and keeps branch-level visibility for Head Coach/Senior.

create table if not exists public.reception_logs (
  id uuid primary key default gen_random_uuid(),
  reception_id uuid references public.profiles(id) on delete set null,
  branch_id uuid references public.branches(id) on delete set null,
  log_date date not null default current_date,
  visitor_name text,
  phone text,
  inquiry_type text,
  outcome text,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.reception_logs add column if not exists reception_id uuid references public.profiles(id) on delete set null;
alter table public.reception_logs add column if not exists branch_id uuid references public.branches(id) on delete set null;
alter table public.reception_logs add column if not exists log_date date default current_date;
alter table public.reception_logs add column if not exists visitor_name text;
alter table public.reception_logs add column if not exists phone text;
alter table public.reception_logs add column if not exists inquiry_type text;
alter table public.reception_logs add column if not exists outcome text;
alter table public.reception_logs add column if not exists notes text;
alter table public.reception_logs add column if not exists created_at timestamptz default now();

create table if not exists public.sales_leads (
  id uuid primary key default gen_random_uuid(),
  sales_id uuid references public.profiles(id) on delete set null,
  branch_id uuid references public.branches(id) on delete set null,
  lead_date date not null default current_date,
  lead_name text,
  phone text,
  source text,
  interest text,
  status text,
  next_followup_date date,
  next_action text,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.sales_leads add column if not exists sales_id uuid references public.profiles(id) on delete set null;
alter table public.sales_leads add column if not exists branch_id uuid references public.branches(id) on delete set null;
alter table public.sales_leads add column if not exists lead_date date default current_date;
alter table public.sales_leads add column if not exists lead_name text;
alter table public.sales_leads add column if not exists phone text;
alter table public.sales_leads add column if not exists source text;
alter table public.sales_leads add column if not exists interest text;
alter table public.sales_leads add column if not exists status text;
alter table public.sales_leads add column if not exists next_followup_date date;
alter table public.sales_leads add column if not exists next_action text;
alter table public.sales_leads add column if not exists notes text;
alter table public.sales_leads add column if not exists created_at timestamptz default now();

alter table public.reception_logs enable row level security;
alter table public.sales_leads enable row level security;

-- Reception policies
DROP POLICY IF EXISTS "reception_select_by_role" ON public.reception_logs;
DROP POLICY IF EXISTS "reception_insert_own" ON public.reception_logs;
DROP POLICY IF EXISTS "reception_update_admin_branch" ON public.reception_logs;
DROP POLICY IF EXISTS "reception_delete_admin" ON public.reception_logs;

create policy "reception_select_by_role" on public.reception_logs
for select using (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
  or reception_id = auth.uid()
);

create policy "reception_insert_own" on public.reception_logs
for insert with check (
  public.is_global_admin()
  or (reception_id = auth.uid() and branch_id = public.current_profile_branch_id())
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
);

create policy "reception_update_admin_branch" on public.reception_logs
for update using (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
  or reception_id = auth.uid()
) with check (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
  or reception_id = auth.uid()
);

create policy "reception_delete_admin" on public.reception_logs
for delete using (public.is_global_admin());

-- Sales policies
DROP POLICY IF EXISTS "sales_select_by_role" ON public.sales_leads;
DROP POLICY IF EXISTS "sales_insert_own" ON public.sales_leads;
DROP POLICY IF EXISTS "sales_update_admin_branch" ON public.sales_leads;
DROP POLICY IF EXISTS "sales_delete_admin" ON public.sales_leads;

create policy "sales_select_by_role" on public.sales_leads
for select using (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
  or sales_id = auth.uid()
);

create policy "sales_insert_own" on public.sales_leads
for insert with check (
  public.is_global_admin()
  or (sales_id = auth.uid() and branch_id = public.current_profile_branch_id())
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
);

create policy "sales_update_admin_branch" on public.sales_leads
for update using (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
  or sales_id = auth.uid()
) with check (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
  or sales_id = auth.uid()
);

create policy "sales_delete_admin" on public.sales_leads
for delete using (public.is_global_admin());

-- Repair/update report permissions used by the UI
DROP POLICY IF EXISTS "daily_logs_update_admin" ON public.trainer_daily_logs;
DROP POLICY IF EXISTS "daily_logs_delete_admin" ON public.trainer_daily_logs;
create policy "daily_logs_update_admin" on public.trainer_daily_logs
for update using (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
) with check (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
);
create policy "daily_logs_delete_admin" on public.trainer_daily_logs
for delete using (public.is_global_admin());

DROP POLICY IF EXISTS "attendance_update_admin_branch" ON public.attendance_logs;
DROP POLICY IF EXISTS "attendance_delete_admin" ON public.attendance_logs;
create policy "attendance_update_admin_branch" on public.attendance_logs
for update using (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
) with check (
  public.is_global_admin()
  or (public.is_branch_leader() and branch_id = public.current_profile_branch_id())
);
create policy "attendance_delete_admin" on public.attendance_logs
for delete using (public.is_global_admin());

DROP POLICY IF EXISTS "senior_reports_delete_admin" ON public.senior_daily_reports;
DROP POLICY IF EXISTS "head_reports_delete_admin" ON public.head_coach_daily_reports;
DROP POLICY IF EXISTS "evaluations_delete_admin" ON public.trainer_evaluations;
create policy "senior_reports_delete_admin" on public.senior_daily_reports
for delete using (public.is_global_admin());
create policy "head_reports_delete_admin" on public.head_coach_daily_reports
for delete using (public.is_global_admin());
create policy "evaluations_delete_admin" on public.trainer_evaluations
for delete using (public.is_global_admin());
