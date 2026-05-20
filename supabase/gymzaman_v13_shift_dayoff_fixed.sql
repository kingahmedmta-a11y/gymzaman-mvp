-- =====================================================
-- Gym Zaman v13 - Shift Schedule + Weekly Day Off Fix
-- جدول الشيفتات ثابت، ويوم الأجازة الأسبوعي جزء من جدول الشيفت.
-- طلب الأجازة / الإذن يتم من جدول coach_requests وليس من coach_shifts.
-- =====================================================

-- Make sure coach_shifts exists
create table if not exists public.coach_shifts (
  id uuid primary key default gen_random_uuid()
);

-- Core trainer / branch columns
alter table public.coach_shifts add column if not exists trainer_id uuid references public.profiles(id) on delete cascade;
alter table public.coach_shifts add column if not exists coach_id uuid references public.profiles(id) on delete cascade;
alter table public.coach_shifts add column if not exists branch_id uuid;

-- Fixed schedule columns
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

-- Weekly day-off columns: keep all aliases because older builds may read different names
alter table public.coach_shifts add column if not exists off_day_weekday text;
alter table public.coach_shifts add column if not exists day_off_weekday text;
alter table public.coach_shifts add column if not exists applies_weekly boolean default true;
alter table public.coach_shifts add column if not exists repeat_weekly boolean default true;

-- Exceptional off-day flags only for special cases, not normal weekly day off
alter table public.coach_shifts add column if not exists is_off_day boolean default false;
alter table public.coach_shifts add column if not exists is_day_off boolean default false;
alter table public.coach_shifts add column if not exists day_off boolean default false;

-- Notes / audit helper columns
alter table public.coach_shifts add column if not exists notes text;
alter table public.coach_shifts add column if not exists created_by uuid references public.profiles(id);
alter table public.coach_shifts add column if not exists updated_by uuid references public.profiles(id);
alter table public.coach_shifts add column if not exists created_at timestamptz default now();
alter table public.coach_shifts add column if not exists updated_at timestamptz default now();

-- Backfill aliases and keep schema consistent
update public.coach_shifts
set
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
  off_day_weekday = coalesce(off_day_weekday, day_off_weekday),
  day_off_weekday = coalesce(day_off_weekday, off_day_weekday),
  applies_weekly = coalesce(applies_weekly, repeat_weekly, true),
  repeat_weekly = coalesce(repeat_weekly, applies_weekly, true),
  is_off_day = coalesce(is_off_day, is_day_off, day_off, false),
  is_day_off = coalesce(is_day_off, is_off_day, day_off, false),
  day_off = coalesce(day_off, is_off_day, is_day_off, false),
  updated_at = now()
where true;

-- Helpful index. Not unique, to avoid failing if older duplicates exist.
create index if not exists coach_shifts_trainer_date_idx
on public.coach_shifts (trainer_id, shift_date);

-- RLS
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
using (
  public.is_global_admin()
);
