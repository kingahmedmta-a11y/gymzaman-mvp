-- =========================================================
-- GYM ZAMAN v17 FINAL FIX
-- Head Coach reports, branch daily reports, trainer tasks visibility,
-- and preventive schema/RLS compatibility for all current UI fields.
-- =========================================================

create extension if not exists pgcrypto;

-- ---------- helper functions ----------
alter table public.profiles add column if not exists name text;
alter table public.profiles add column if not exists branch_name text;
alter table public.profiles add column if not exists active boolean default true;
alter table public.profiles add column if not exists status text default 'active';

update public.profiles set active = true where active is null;
update public.profiles set status = coalesce(status, 'active');
update public.profiles set name = coalesce(name, full_name, email) where name is null;
update public.profiles p set branch_name = coalesce(p.branch_name, b.name) from public.branches b where p.branch_id = b.id;

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
      and p.role in ('owner','admin','fitness_director')
  );
$$;
grant execute on function public.is_global_admin() to authenticated;

create or replace function public.is_owner_only()
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
      and p.role in ('owner','admin')
  );
$$;
grant execute on function public.is_owner_only() to authenticated;

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
      and p.role in ('head_coach','senior','owner','admin','fitness_director')
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

-- =========================================================
-- TRAINER TASKS: full compatibility with task_title/task_details/title/description
-- =========================================================
create table if not exists public.trainer_tasks (id uuid primary key default gen_random_uuid());
alter table public.trainer_tasks add column if not exists trainer_id uuid references public.profiles(id) on delete cascade;
alter table public.trainer_tasks add column if not exists coach_id uuid references public.profiles(id) on delete cascade;
alter table public.trainer_tasks add column if not exists assigned_by uuid references public.profiles(id);
alter table public.trainer_tasks add column if not exists created_by uuid references public.profiles(id);
alter table public.trainer_tasks add column if not exists updated_by uuid references public.profiles(id);
alter table public.trainer_tasks add column if not exists completed_by uuid references public.profiles(id);
alter table public.trainer_tasks add column if not exists branch_id uuid;
alter table public.trainer_tasks add column if not exists task_title text;
alter table public.trainer_tasks add column if not exists task_details text;
alter table public.trainer_tasks add column if not exists title text;
alter table public.trainer_tasks add column if not exists description text;
alter table public.trainer_tasks add column if not exists priority text default 'normal';
alter table public.trainer_tasks add column if not exists status text default 'pending';
alter table public.trainer_tasks add column if not exists due_date date;
alter table public.trainer_tasks add column if not exists completed_at timestamptz;
alter table public.trainer_tasks add column if not exists created_at timestamptz default now();
alter table public.trainer_tasks add column if not exists updated_at timestamptz default now();

update public.trainer_tasks
set coach_id = coalesce(coach_id, trainer_id),
    trainer_id = coalesce(trainer_id, coach_id),
    title = coalesce(title, task_title),
    task_title = coalesce(task_title, title),
    description = coalesce(description, task_details),
    task_details = coalesce(task_details, description),
    created_by = coalesce(created_by, assigned_by),
    updated_at = now()
where true;

create or replace function public.before_save_trainer_task()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare v_branch uuid;
begin
  new.updated_at := now();
  new.trainer_id := coalesce(new.trainer_id, new.coach_id);
  new.coach_id := coalesce(new.coach_id, new.trainer_id);
  select p.branch_id into v_branch from public.profiles p where p.id = new.trainer_id limit 1;
  new.branch_id := coalesce(new.branch_id, v_branch);
  new.task_title := coalesce(new.task_title, new.title);
  new.title := coalesce(new.title, new.task_title);
  new.task_details := coalesce(new.task_details, new.description);
  new.description := coalesce(new.description, new.task_details);
  new.status := coalesce(new.status, 'pending');
  new.priority := coalesce(new.priority, 'normal');
  if new.status in ('done','completed') and new.completed_at is null then
    new.completed_at := now();
    new.completed_by := coalesce(new.completed_by, auth.uid());
  end if;
  return new;
end;
$$;
drop trigger if exists trg_before_save_trainer_task on public.trainer_tasks;
create trigger trg_before_save_trainer_task before insert or update on public.trainer_tasks for each row execute function public.before_save_trainer_task();

-- =========================================================
-- HEAD COACH TRAINER REPORTS
-- =========================================================
create table if not exists public.head_coach_trainer_reports (id uuid primary key default gen_random_uuid());
alter table public.head_coach_trainer_reports add column if not exists head_coach_id uuid references public.profiles(id);
alter table public.head_coach_trainer_reports add column if not exists trainer_id uuid references public.profiles(id) on delete cascade;
alter table public.head_coach_trainer_reports add column if not exists branch_id uuid;
alter table public.head_coach_trainer_reports add column if not exists report_date date default current_date;
alter table public.head_coach_trainer_reports add column if not exists performance_score numeric default 0;
alter table public.head_coach_trainer_reports add column if not exists commitment_score numeric default 0;
alter table public.head_coach_trainer_reports add column if not exists service_score numeric default 0;
alter table public.head_coach_trainer_reports add column if not exists total_score numeric default 0;
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
  new.head_coach_id := coalesce(new.head_coach_id, new.created_by, auth.uid());
  new.created_by := coalesce(new.created_by, new.head_coach_id, auth.uid());
  select p.branch_id into v_branch from public.profiles p where p.id = new.trainer_id limit 1;
  new.branch_id := coalesce(new.branch_id, v_branch);
  new.total_score := coalesce(new.total_score, round(((coalesce(new.performance_score,0)+coalesce(new.commitment_score,0)+coalesce(new.service_score,0))/3.0)::numeric,2));
  return new;
end;
$$;
drop trigger if exists trg_before_save_head_coach_trainer_report on public.head_coach_trainer_reports;
create trigger trg_before_save_head_coach_trainer_report before insert or update on public.head_coach_trainer_reports for each row execute function public.before_save_head_coach_trainer_report();

-- =========================================================
-- BRANCH DAILY REPORTS
-- =========================================================
create table if not exists public.branch_daily_reports (id uuid primary key default gen_random_uuid());
alter table public.branch_daily_reports add column if not exists head_coach_id uuid references public.profiles(id);
alter table public.branch_daily_reports add column if not exists branch_id uuid;
alter table public.branch_daily_reports add column if not exists report_date date default current_date;
alter table public.branch_daily_reports add column if not exists present_trainers integer default 0;
alter table public.branch_daily_reports add column if not exists absent_trainers integer default 0;
alter table public.branch_daily_reports add column if not exists branch_traffic text default 'normal';
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
declare v_branch uuid;
begin
  new.updated_at := now();
  new.head_coach_id := coalesce(new.head_coach_id, new.created_by, auth.uid());
  new.created_by := coalesce(new.created_by, new.head_coach_id, auth.uid());
  select p.branch_id into v_branch from public.profiles p where p.id = new.head_coach_id limit 1;
  new.branch_id := coalesce(new.branch_id, v_branch);
  new.present_trainers := coalesce(new.present_trainers,0);
  new.absent_trainers := coalesce(new.absent_trainers,0);
  new.branch_traffic := coalesce(new.branch_traffic,'normal');
  return new;
end;
$$;
drop trigger if exists trg_before_save_branch_daily_report on public.branch_daily_reports;
create trigger trg_before_save_branch_daily_report before insert or update on public.branch_daily_reports for each row execute function public.before_save_branch_daily_report();

-- =========================================================
-- COACH REQUESTS compatibility, because director page uses them
-- =========================================================
create table if not exists public.coach_requests (id uuid primary key default gen_random_uuid());
alter table public.coach_requests add column if not exists coach_id uuid references public.profiles(id) on delete cascade;
alter table public.coach_requests add column if not exists trainer_id uuid references public.profiles(id) on delete cascade;
alter table public.coach_requests add column if not exists requested_by uuid references public.profiles(id);
alter table public.coach_requests add column if not exists created_by uuid references public.profiles(id);
alter table public.coach_requests add column if not exists branch_id uuid;
alter table public.coach_requests add column if not exists request_type text default 'permission';
alter table public.coach_requests add column if not exists type text default 'permission';
alter table public.coach_requests add column if not exists request_title text;
alter table public.coach_requests add column if not exists title text;
alter table public.coach_requests add column if not exists reason text;
alter table public.coach_requests add column if not exists notes text;
alter table public.coach_requests add column if not exists request_date date default current_date;
alter table public.coach_requests add column if not exists start_date date;
alter table public.coach_requests add column if not exists end_date date;
alter table public.coach_requests add column if not exists from_time time;
alter table public.coach_requests add column if not exists to_time time;
alter table public.coach_requests add column if not exists minutes integer default 0;
alter table public.coach_requests add column if not exists requested_minutes integer default 0;
alter table public.coach_requests add column if not exists amount numeric default 0;
alter table public.coach_requests add column if not exists status text default 'pending';
alter table public.coach_requests add column if not exists admin_note text;
alter table public.coach_requests add column if not exists director_note text;
alter table public.coach_requests add column if not exists reviewed_by uuid references public.profiles(id);
alter table public.coach_requests add column if not exists approved_by uuid references public.profiles(id);
alter table public.coach_requests add column if not exists reviewed_at timestamptz;
alter table public.coach_requests add column if not exists approved_at timestamptz;
alter table public.coach_requests add column if not exists created_at timestamptz default now();
alter table public.coach_requests add column if not exists updated_at timestamptz default now();

-- =========================================================
-- RLS policies: director/owner see all; branch leaders see own branch; trainer sees own
-- =========================================================

do $$
declare tbl text;
begin
  foreach tbl in array array['trainer_tasks','head_coach_trainer_reports','branch_daily_reports','coach_requests'] loop
    execute format('alter table public.%I enable row level security', tbl);
  end loop;
end $$;

-- trainer_tasks policies
drop policy if exists "trainer_tasks_select" on public.trainer_tasks;
drop policy if exists "trainer_tasks_insert" on public.trainer_tasks;
drop policy if exists "trainer_tasks_update" on public.trainer_tasks;
drop policy if exists "trainer_tasks_delete" on public.trainer_tasks;
create policy "trainer_tasks_select" on public.trainer_tasks for select using (trainer_id=auth.uid() or coach_id=auth.uid() or public.is_global_admin() or (public.is_branch_leader() and branch_id=public.current_profile_branch_id()));
create policy "trainer_tasks_insert" on public.trainer_tasks for insert with check (public.is_global_admin() or (public.is_branch_leader() and branch_id=public.current_profile_branch_id()));
create policy "trainer_tasks_update" on public.trainer_tasks for update using (trainer_id=auth.uid() or coach_id=auth.uid() or public.is_global_admin() or (public.is_branch_leader() and branch_id=public.current_profile_branch_id())) with check (trainer_id=auth.uid() or coach_id=auth.uid() or public.is_global_admin() or (public.is_branch_leader() and branch_id=public.current_profile_branch_id()));
create policy "trainer_tasks_delete" on public.trainer_tasks for delete using (public.is_global_admin());

-- head_coach_trainer_reports policies
drop policy if exists "head_trainer_reports_select" on public.head_coach_trainer_reports;
drop policy if exists "head_trainer_reports_insert" on public.head_coach_trainer_reports;
drop policy if exists "head_trainer_reports_update" on public.head_coach_trainer_reports;
drop policy if exists "head_trainer_reports_delete" on public.head_coach_trainer_reports;
create policy "head_trainer_reports_select" on public.head_coach_trainer_reports for select using (head_coach_id=auth.uid() or trainer_id=auth.uid() or public.is_global_admin() or (public.is_branch_leader() and branch_id=public.current_profile_branch_id()));
create policy "head_trainer_reports_insert" on public.head_coach_trainer_reports for insert with check (public.is_global_admin() or (public.is_branch_leader() and branch_id=public.current_profile_branch_id()));
create policy "head_trainer_reports_update" on public.head_coach_trainer_reports for update using (public.is_global_admin() or (public.is_branch_leader() and branch_id=public.current_profile_branch_id())) with check (public.is_global_admin() or (public.is_branch_leader() and branch_id=public.current_profile_branch_id()));
create policy "head_trainer_reports_delete" on public.head_coach_trainer_reports for delete using (public.is_global_admin());

-- branch_daily_reports policies
drop policy if exists "branch_daily_reports_select" on public.branch_daily_reports;
drop policy if exists "branch_daily_reports_insert" on public.branch_daily_reports;
drop policy if exists "branch_daily_reports_update" on public.branch_daily_reports;
drop policy if exists "branch_daily_reports_delete" on public.branch_daily_reports;
create policy "branch_daily_reports_select" on public.branch_daily_reports for select using (head_coach_id=auth.uid() or public.is_global_admin() or (public.is_branch_leader() and branch_id=public.current_profile_branch_id()));
create policy "branch_daily_reports_insert" on public.branch_daily_reports for insert with check (public.is_global_admin() or (public.is_branch_leader() and branch_id=public.current_profile_branch_id()));
create policy "branch_daily_reports_update" on public.branch_daily_reports for update using (public.is_global_admin() or (public.is_branch_leader() and branch_id=public.current_profile_branch_id())) with check (public.is_global_admin() or (public.is_branch_leader() and branch_id=public.current_profile_branch_id()));
create policy "branch_daily_reports_delete" on public.branch_daily_reports for delete using (public.is_global_admin());

-- coach_requests policies
drop policy if exists "coach_requests_select" on public.coach_requests;
drop policy if exists "coach_requests_insert" on public.coach_requests;
drop policy if exists "coach_requests_update" on public.coach_requests;
drop policy if exists "coach_requests_delete" on public.coach_requests;
create policy "coach_requests_select" on public.coach_requests for select using (trainer_id=auth.uid() or coach_id=auth.uid() or requested_by=auth.uid() or created_by=auth.uid() or public.is_global_admin() or (public.is_branch_leader() and branch_id=public.current_profile_branch_id()));
create policy "coach_requests_insert" on public.coach_requests for insert with check (trainer_id=auth.uid() or coach_id=auth.uid() or requested_by=auth.uid() or created_by=auth.uid() or public.is_global_admin() or (public.is_branch_leader() and branch_id=public.current_profile_branch_id()));
create policy "coach_requests_update" on public.coach_requests for update using (trainer_id=auth.uid() or coach_id=auth.uid() or requested_by=auth.uid() or created_by=auth.uid() or public.is_global_admin() or (public.is_branch_leader() and branch_id=public.current_profile_branch_id())) with check (trainer_id=auth.uid() or coach_id=auth.uid() or requested_by=auth.uid() or created_by=auth.uid() or public.is_global_admin() or (public.is_branch_leader() and branch_id=public.current_profile_branch_id()));
create policy "coach_requests_delete" on public.coach_requests for delete using (public.is_global_admin());

-- =========================================================
-- schema cache refresh + verification
-- =========================================================
notify pgrst, 'reload schema';

select 'GYM_ZAMAN_V17_REPORTS_TASKS_FIX_DONE' as status, now() as finished_at;
