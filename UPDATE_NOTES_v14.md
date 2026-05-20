# Gym Zaman v14 Final Clean

- Removed Add Client from Fitness Director view.
- Added Clients view for Fitness Director/Owner/Branch Leaders to review client data and files.
- Fixed weekly shift logic: day off is now a fixed weekly day, separate from vacation/permission requests.
- Removed the need to tick day-off to save a normal shift.
- Added robust Supabase schema migration for coach_shifts, attendance_punches, coach_requests, trainer_tasks, monthly_target_plans and helper functions.
- Added schema reload notification for Supabase/PostgREST.
- Build tested successfully with `npm run build`.
