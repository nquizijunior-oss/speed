# SPEED PERMIS — Shared Editable App

Every user-visible text node is editable. Plain text uses a single click; buttons, links and menu items keep their normal single-click behavior and enter edit mode on double-click. Enter or clicking away saves; Escape cancels.

Edits and the app's local state are mirrored to Supabase so the same values can be shared across browsers. Supabase Realtime pushes changes to open browsers without polling.

## Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase_shared_edits.sql`.
3. Copy `.env.example` to `.env`.
4. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from the Supabase project API settings.
5. Never put a database password or service-role/secret key in `.env` for this Vite frontend.

## Local development

```bash
npm install
npm run dev
```

Because this is intentionally unauthenticated, anyone who can access the deployed app can edit the shared content. The database policies are therefore deliberately public for this project.
