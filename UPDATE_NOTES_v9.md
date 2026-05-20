# Gym Zaman v9 — Security, Automation, Clarity

## Added
- Cleaner interface with quick actions for common tasks.
- Owner and Fitness Director full control from the main dashboard.
- Reception and Sales are visible only to Owner/Fitness Director.
- Export JSON backup for all loaded system data.
- More automatic audit logging from the app and database SQL trigger.
- Inactive profile protection: inactive users are blocked after login.
- Improved clarity of forms, table readability, section titles, and mobile layout.

## Supabase
Run:
`supabase/gymzaman_v9_security_automation_control.sql`

This adds:
- `is_control_admin()` for owner/director/admin control.
- Owner/director-only Reception and Sales RLS policies.
- Safer delete policies.
- Automatic audit triggers for inserts, updates, and deletes.
