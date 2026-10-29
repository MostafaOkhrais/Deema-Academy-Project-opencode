# Deema Academy · أكاديمية ديمة

An Arabic-first, RTL learning platform for health-specialty students and practitioners. The public site, application flow, member portal, verification page, and admin dashboard are built as one React application, with Supabase as the backend.

**Live domain (placeholder):** `deema.academy`

---

## Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS 4 (design tokens in `src/styles/globals.css`)
- React Router 7 (client-side routing, SEO metadata per page)
- React Hook Form + Zod (public forms)
- Supabase (Auth, Postgres, RLS, Storage)
- `qrcode.react` for the digital member card

The visual identity uses navy `#002147`, sky `#91C8E0`, paper `#F2F2F2`, and self-hosted Thmanyah fonts. There is no dark mode and no language toggle; the experience is Arabic-only RTL by design.

---

## Getting started

```bash
npm install
cp .env.example .env.local   # optional; leave blank for demo mode
npm run dev
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check and production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Type-check only |

### Demo mode

If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are missing, the site runs without a backend:

- The join form and event-interest form succeed and save to `localStorage`.
- The application status lookup returns demo data.
- The admin dashboard uses demo rows.
- Member activation and login are unavailable.

No keys are required to review the UI.

---

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/migrations/0001_init.sql` in the SQL editor (or `supabase db push`).
3. Run `supabase/seed.sql` to load the five tracks, three events, twelve FAQs, and the announcement.
4. Copy the project URL and **anon** key into `.env.local`:

   ```env
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
   ```

5. In **Authentication → URL Configuration**, set the site URL and add the production/deployment URLs to the redirect allow-list.
6. Sign up once with the email that should own the admin dashboard, then promote that profile:

   ```sql
   update public.profiles
   set role = 'admin'
   where email = 'you@example.com';
   ```

### Membership activation

Acceptance generates a code in the form `DM-2026-####`. The applicant signs up with **the same email used in the application**, then activates the account with the member code and university ID. The `claim_membership` RPC verifies:

- the application is accepted,
- the authenticated email matches the application email,
- the university ID matches when the application contains one,
- the code has not been claimed by another profile.

Membership validity defaults to one year from activation in `claim_membership`. Change that policy when the membership model is finalized.

### Database overview

| Table / object | Purpose |
| --- | --- |
| `profiles` | One row per auth user; member code, role, track, validity |
| `applications` | Join requests, review status, generated member code |
| `event_registrations` | Workshop interest/registration |
| `tracks`, `events`, `faqs`, `announcements`, `team` | Public content, admin-managed |
| `certificates` | Issued certificates and public verification codes |
| `complaints` | Contact/triage queue |
| `audit_log` | Admin actions (e.g. application acceptance) |
| `public_member_cards` | Sanitized, active-members-only view for `/verify/:code` |
| `lookup_application` | Limited public status lookup (email or phone) |
| `accept_application` | Admin-only acceptance + atomic code generation |
| `claim_membership` | Activation RPC described above |

RLS is enabled on every table. Public inserts are restricted to `pending` applications, `interest` registrations, and `new` complaints. Profiles are visible only to their owner or admins; the public card view exposes printed card fields only. Storage buckets: `avatars` (public, owner-write), `media` (public, admin-write), `receipts` (private, owner/admin-read).

---

## Routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | About and founder story |
| `/tracks`, `/tracks/:slug` | Five learning tracks |
| `/events`, `/events/:slug` | Events and workshop registration |
| `/faq` | Searchable FAQ |
| `/join` | Two-step application + live card preview + status lookup |
| `/login` | Sign in / activate membership |
| `/account` | Member dashboard and digital card |
| `/verify/:code` | Public member-card verification |
| `/admin` | Admin dashboard (overview, applications, members, registrations) |
| `/privacy`, `/terms` | Legal pages |
| `*` | 404 |

---

## Project structure

```text
src/
  components/        layout, UI primitives, home sections, cards
  data/              site copy, tracks, events, FAQs, types
  lib/               Supabase client, auth, applications, events, SEO
  pages/             one component per route
  styles/globals.css design tokens, surfaces, buttons, fields, motion
public/
  brand/             logo mark and founder illustrations
  fonts/             self-hosted Thmanyah font files
supabase/
  migrations/0001_init.sql
  seed.sql
```

---

## Deployment

The repository includes `vercel.json` with an SPA rewrite so deep links resolve to `index.html`.

1. Import the repository into Vercel (framework preset: Vite).
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the project environment variables.
3. Deploy. Build command: `npm run build`; output directory: `dist`.

---

## Content status

The interface and content model are complete, but a few facts must be confirmed before launch and are intentionally marked as placeholders:

- final domain, contact email, and social links,
- workshop/event dates and the membership/pricing model,
- team names and photos,
- final privacy and terms wording.

Event dates, prices, and the membership model are never invented in the UI; they show “يُعلن قريباً” where applicable. Update `src/data/*` and the Supabase seed together when those facts are confirmed.
