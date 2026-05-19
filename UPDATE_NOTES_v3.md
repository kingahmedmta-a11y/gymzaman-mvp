# Gym Zaman MVP v3

Updated according to the requested operational changes:

- Added branch selector under login while keeping real permissions controlled by Supabase profiles/RLS.
- Fixed auto-save draft keys for Senior reports, Head Coach reports, Attendance, and Trainer Evaluation forms.
- Preserved Trainer privacy: trainer views only own clients/logs/programs by profile scope.
- Head Coach/Senior can view all coaches and operational data in their own branch only.
- Head Coach/Senior can edit branch clients, attendance, daily logs, and PT programs; deletion remains Owner/Fitness Director only.
- Owner/Fitness Director can edit and delete operational records and manage staff profiles.
- Added clear branch staff overview for Head Coach/Senior inside Trainer Data.
- Removed duplicate tabs and fixed login branch mismatch notice variable.

Security note: real privacy still depends on Supabase RLS policies matching the profiles table roles and branch_id values.
