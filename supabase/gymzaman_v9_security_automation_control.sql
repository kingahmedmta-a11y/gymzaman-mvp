-- Gym Zaman v9 security, automation and control update
-- Run this once in Supabase SQL Editor after uploading v9.

alter table if exists public.profiles add column if not exists active boolean default true;
update public.profiles set active = true where active is null;

create or replace function public.is_control_admin()
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
      and coalesce(p.status, 'active') = 'active'
      and p.role in ('owner', 'admin', 'fitness_director')
  );
$$;

grant execute on function public.is_control_admin() to authenticated;

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
      and coalesce(p.status, 'active') = 'active'
      and p.role in ('head_coach', 'senior')
  );
$$;

grant execute on function public.is_branch_leader() to authenticated;

-- Reception and Sales are hidden from coaches and controlled only by Owner/Fitness Director/Admin.
alter table if exists public.reception_logs enable row level security;
alter table if exists public.sales_leads enable row level security;

drop policy if exists "reception_select_control_admin" on public.reception_logs;
drop policy if exists "reception_insert_control_admin" on public.reception_logs;
drop policy if exists "reception_update_control_admin" on public.reception_logs;
drop policy if exists "reception_delete_control_admin" on public.reception_logs;

create policy "reception_select_control_admin" on public.reception_logs for select using (public.is_control_admin());
create policy "reception_insert_control_admin" on public.reception_logs for insert with check (public.is_control_admin());
create policy "reception_update_control_admin" on public.reception_logs for update using (public.is_control_admin()) with check (public.is_control_admin());
create policy "reception_delete_control_admin" on public.reception_logs for delete using (public.is_control_admin());

drop policy if exists "sales_select_control_admin" on public.sales_leads;
drop policy if exists "sales_insert_control_admin" on public.sales_leads;
drop policy if exists "sales_update_control_admin" on public.sales_leads;
drop policy if exists "sales_delete_control_admin" on public.sales_leads;

create policy "sales_select_control_admin" on public.sales_leads for select using (public.is_control_admin());
create policy "sales_insert_control_admin" on public.sales_leads for insert with check (public.is_control_admin());
create policy "sales_update_control_admin" on public.sales_leads for update using (public.is_control_admin()) with check (public.is_control_admin());
create policy "sales_delete_control_admin" on public.sales_leads for delete using (public.is_control_admin());

-- Control admins can manage profiles from Staff Management.
alter table if exists public.profiles enable row level security;
drop policy if exists "profiles_update_control_admin" on public.profiles;
create policy "profiles_update_control_admin" on public.profiles for update using (public.is_control_admin()) with check (public.is_control_admin());

-- Safer delete permissions for operational tables.
do $$
declare tbl text;
begin
  foreach tbl in array array[
    'clients','trainer_daily_logs','attendance_logs','pt_programs','trainer_evaluations',
    'senior_daily_reports','head_coach_daily_reports','reception_logs','sales_leads'
  ] loop
    execute format('alter table if exists public.%I enable row level security', tbl);
    execute format('drop policy if exists %I on public.%I', tbl || '_delete_control_admin', tbl);
    execute format('create policy %I on public.%I for delete using (public.is_control_admin())', tbl || '_delete_control_admin', tbl);
  end loop;
end $$;

-- Database-level audit trigger: every insert/update/delete is saved automatically.
create or replace function public.gz_audit_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  row_id uuid;
  payload jsonb;
begin
  if tg_op = 'DELETE' then
    row_id := old.id;
    payload := to_jsonb(old);
  else
    row_id := new.id;
    payload := to_jsonb(new);
  end if;

  insert into public.audit_logs(actor_id, action, entity_type, entity_id, details)
  values (auth.uid(), lower(tg_op), tg_table_name, row_id, payload);

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
exception when others then
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'clients','trainer_daily_logs','attendance_logs','pt_programs','trainer_evaluations',
    'senior_daily_reports','head_coach_daily_reports','reception_logs','sales_leads','profiles'
  ] loop
    if to_regclass('public.' || tbl) is not null then
      execute format('drop trigger if exists gz_audit_%I on public.%I', tbl, tbl);
      execute format('create trigger gz_audit_%I after insert or update or delete on public.%I for each row execute function public.gz_audit_trigger()', tbl, tbl);
    end if;
  end loop;
end $$;
