# Gym Zaman MVP v2 RBAC Update

## Added
- Branch selector under Login screen for Miami, Moharram Bey, and Janaklis.
- Auto-save drafts for client entry, daily logs, attendance, PT programs, senior reports, head coach reports, and trainer evaluations.
- Owner/Fitness Director can edit and delete operational records from tables.
- Head Coach/Senior can edit branch records but cannot delete them.
- Head Coach/Senior view remains restricted to their own branch staff and branch reports.
- Added attendance edit support from management tables.

## Security note
The branch selector on login is not used to grant permissions. Real access still comes from the logged-in user's profile role and branch_id. Keep Supabase RLS policies enabled.
