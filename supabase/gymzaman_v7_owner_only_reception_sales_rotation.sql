-- Gym Zaman v7 update
-- هدف الملف:
-- 1) منع الهيد كوتش/السينيور/المدربين من رؤية الريسيبشن والسيلز
-- 2) الأونر فقط يطلع على كل بيانات الريسيبشن والسيلز
-- 3) ربط Rotation الريسيبشن بكوتش محدد من الفرع
-- 4) حذف التقارير يكون للأونر فقط

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role() = 'owner', false);
$$;

-- Reception rotation link
alter table public.reception_logs add column if not exists assigned_trainer_id uuid references public.profiles(id) on delete set null;
alter table public.reception_logs add column if not exists assigned_trainer_name text;

-- Keep Sales / Reception tables ready even if you have not added Sales/Reception emails yet
alter table public.reception_logs enable row level security;
alter table public.sales_leads enable row level security;

-- Remove old broad policies that allowed branch leaders/director to see these sections
DROP POLICY IF EXISTS "reception_select_by_role" ON public.reception_logs;
DROP POLICY IF EXISTS "reception_insert_own" ON public.reception_logs;
DROP POLICY IF EXISTS "reception_update_admin_branch" ON public.reception_logs;
DROP POLICY IF EXISTS "reception_delete_admin" ON public.reception_logs;
DROP POLICY IF EXISTS "sales_select_by_role" ON public.sales_leads;
DROP POLICY IF EXISTS "sales_insert_own" ON public.sales_leads;
DROP POLICY IF EXISTS "sales_update_admin_branch" ON public.sales_leads;
DROP POLICY IF EXISTS "sales_delete_admin" ON public.sales_leads;

-- Reception: owner sees all. Reception user, if added later, sees/inserts own records only.
create policy "reception_select_owner_or_own" on public.reception_logs
for select using (
  public.is_owner()
  or reception_id = auth.uid()
);

create policy "reception_insert_owner_or_own" on public.reception_logs
for insert with check (
  public.is_owner()
  or (
    public.current_profile_role() = 'reception'
    and reception_id = auth.uid()
    and branch_id = public.current_profile_branch_id()
  )
);

create policy "reception_update_owner_or_own" on public.reception_logs
for update using (
  public.is_owner()
  or reception_id = auth.uid()
) with check (
  public.is_owner()
  or reception_id = auth.uid()
);

create policy "reception_delete_owner" on public.reception_logs
for delete using (public.is_owner());

-- Sales: owner sees all. Sales user, if added later, sees/inserts own leads only.
create policy "sales_select_owner_or_own" on public.sales_leads
for select using (
  public.is_owner()
  or sales_id = auth.uid()
);

create policy "sales_insert_owner_or_own" on public.sales_leads
for insert with check (
  public.is_owner()
  or (
    public.current_profile_role() = 'sales'
    and sales_id = auth.uid()
    and branch_id = public.current_profile_branch_id()
  )
);

create policy "sales_update_owner_or_own" on public.sales_leads
for update using (
  public.is_owner()
  or sales_id = auth.uid()
) with check (
  public.is_owner()
  or sales_id = auth.uid()
);

create policy "sales_delete_owner" on public.sales_leads
for delete using (public.is_owner());

-- Owner-only deletion for reports and operational records
DROP POLICY IF EXISTS "daily_logs_delete_admin" ON public.trainer_daily_logs;
DROP POLICY IF EXISTS "attendance_delete_admin" ON public.attendance_logs;
DROP POLICY IF EXISTS "pt_programs_delete_admin" ON public.pt_programs;
DROP POLICY IF EXISTS "senior_reports_delete_admin" ON public.senior_daily_reports;
DROP POLICY IF EXISTS "head_reports_delete_admin" ON public.head_coach_daily_reports;
DROP POLICY IF EXISTS "evaluations_delete_admin" ON public.trainer_evaluations;

create policy "daily_logs_delete_owner" on public.trainer_daily_logs
for delete using (public.is_owner());
create policy "attendance_delete_owner" on public.attendance_logs
for delete using (public.is_owner());
create policy "pt_programs_delete_owner" on public.pt_programs
for delete using (public.is_owner());
create policy "senior_reports_delete_owner" on public.senior_daily_reports
for delete using (public.is_owner());
create policy "head_reports_delete_owner" on public.head_coach_daily_reports
for delete using (public.is_owner());
create policy "evaluations_delete_owner" on public.trainer_evaluations
for delete using (public.is_owner());

-- Audit log full view for owner only
DROP POLICY IF EXISTS "audit_select_admin" ON public.audit_logs;
create policy "audit_select_owner" on public.audit_logs
for select using (public.is_owner());
