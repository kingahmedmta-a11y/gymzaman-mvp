# Gym Zaman MVP

Free MVP web app for Gym Zaman using React/Vite + Supabase.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown in terminal.

## Supabase env

The app uses:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

These are already placed in `.env.local` for the current project.

## Demo accounts

Use the users created in Supabase Authentication:

- owner@gymzaman.com
- director@gymzaman.com
- trainer1@gymzaman.com

## Important

Do not place the Supabase `service_role` key in this app.
Only use the anon/public key.
