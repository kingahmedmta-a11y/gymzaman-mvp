# Gym Zaman v16

- Added a dedicated Head Coach Reports page.
- Head Coach can submit a report about each trainer in their branch.
- Head Coach can submit a daily report about the branch and trainer status.
- Owner and Fitness Director can view all Head Coach reports across branches.
- Added System Tools page for Owner/Fitness Director.
- Owner/Fitness Director can export JSON backup for all branches or a selected branch.
- Owner/Fitness Director can reset operational monthly data and start a new month.
- Reset keeps profiles, branches, and fixed shift schedules by default.
- Optional reset can also delete clients and PT programs.

Run this SQL in Supabase after deployment:

`supabase/gymzaman_v16_head_reports_backup_reset.sql`
