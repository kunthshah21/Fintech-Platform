# YieldVest

**YieldVest** is an alternative investment marketplace web app: investors browse curated opportunities, manage a portfolio, complete KYC-style onboarding, and use a social community layer. A separate **staff console** lets internal users review clients, tickets, and community moderation.

This repository is a **React single-page application** backed by **Supabase** (PostgreSQL + Auth). Marketplace listings and rich opportunity detail are driven by **in-app mock data**; user identity, profiles, investments, watchlists, tickets, and community content persist in the database.

---

## Tech stack

| Layer | Choice |
|--------|--------|
| UI | React 19, JSX |
| Build & dev | Vite 8 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`), design tokens in `src/index.css` |
| Typography | Inter (Google Fonts, linked in `index.html`) |
| Routing | React Router 7 |
| Backend | Supabase: Auth, PostgreSQL via `@supabase/supabase-js` |
| Charts | Recharts |
| Motion | Framer Motion |
| Icons | Lucide React |

Linting uses ESLint 9 with the React and React Hooks plugins.

---

## Project layout

```
src/
  App.jsx                 # Routes and auth guards (investor vs staff)
  main.jsx
  index.css               # Tailwind + @theme design tokens
  context/
    AppContext.jsx        # Session, profile, portfolio, KYC, onboarding, watchlist
    StaffContext.jsx      # Staff session and CRM-style aggregates
  layouts/
    DashboardLayout.jsx   # Investor shell (sidebar, header)
    StaffLayout.jsx       # Staff shell
  pages/                  # Feature screens (Landing, Login, Dashboard, Marketplace, …)
  pages/staff/            # Staff dashboard, clients, tickets, community moderation
  components/             # Shared UI, dashboard widgets, staff tables
  data/
    mockData.js           # Investment opportunities and default notifications
  lib/
    supabase.js           # Supabase client (env-based)
supabase/
  schema.sql              # Core tables, triggers, indexes
  staff_crm.sql           # Migration: roles, staff notes, ticket extensions, moderation
```

---

## Architecture and design choices

- **Client-only SPA**: All UI runs in the browser. There is no custom Node API in this repo; Supabase is the backend.
- **Two personas, one Auth provider**: Investors and staff both use Supabase Auth. Staff access is determined by a `role` column on `profiles` (`investor` vs `staff`). Staff routes are wrapped in `StaffRoute`, which checks `StaffContext`.
- **Mock marketplace vs live user data**: Opportunities (`mockData.js`) are static JSON-like structures so the product team can demo rich detail pages without seeding a deals table. User-specific data (profile, investments, watchlist, tickets, posts) is loaded and updated through Supabase in `AppContext`.
- **Investor profiling**: Onboarding answers are stored as JSON on the profile and used to compute quadrant-based recommendations (see `computeInvestorProfile` / `getRecommendations` in `AppContext.jsx`).
- **UI consistency**: Tailwind `@theme` variables (`--color-bg`, `--color-accent`, etc.) keep surfaces, borders, and typography aligned across marketing pages and the dashboard.
- **Charts and motion**: Recharts powers portfolio and dashboard visuals; Framer Motion is used for polished transitions where components need it.

---

## Database schema (overview)

Apply SQL in order: run `supabase/schema.sql` first, then `supabase/staff_crm.sql` on the same Supabase project.

### Core (`schema.sql`)

| Table | Purpose |
|--------|---------|
| `profiles` | One row per `auth.users` id: identity, onboarding/KYC fields, portfolio aggregates, wallet, `onboarding_answers` (JSONB). Foreign key to `auth.users`. |
| `investments` | Per-user positions linked to opportunities via `opportunity_id` (text, matches mock IDs). |
| `tickets` | Support tickets; `ticket_number` auto-generated (`TKT-001`, …) via trigger. |
| `watchlist` | `(user_id, opportunity_id)` pairs. |
| `community_posts` | Feed posts with optional `shared_data` (JSONB); like/comment counts maintained by triggers. |
| `community_comments` | Comments on posts. |
| `community_likes` | Post likes; unique per `(post_id, user_id)`. |

Triggers keep `updated_at`, ticket numbers, and community counts in sync.

**Note:** The bundled SQL disables Row Level Security (`ALTER TABLE … DISABLE ROW LEVEL SECURITY`) for simpler local/academic setups. For any real deployment, you should enable RLS and write policies that match your threat model.

### Staff CRM (`staff_crm.sql`)

- Adds `role` (`investor` | `staff`) and optional `priority` on `profiles`.
- Adds `staff_notes` for relationship-manager notes.
- Extends `tickets` with `assigned_to` and `resolution_notes`.
- Adds moderation fields on `community_posts` (`hidden`, `hidden_by`, `hidden_at`).

---

## Local setup

### Prerequisites

- Node.js 18+ (recommended: current LTS)
- A [Supabase](https://supabase.com) project

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create a `.env` file in the project root (Vite exposes only variables prefixed with `VITE_`):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

You can copy the URL and anon key from the Supabase project **Settings → API**.

### 3. Apply the database schema

In the Supabase SQL editor (or `psql`), run:

1. Full contents of `supabase/schema.sql`
2. Full contents of `supabase/staff_crm.sql`

Ensure **Auth** is enabled so `profiles.id` can reference `auth.users(id)`.

### 4. Run the dev server

```bash
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

### Other scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint across the project |

---

## Routes (summary)

| Path | Notes |
|------|--------|
| `/` | Landing |
| `/login`, `/onboarding` | Investor auth and onboarding |
| `/dashboard`, `/dashboard/marketplace`, `/dashboard/opportunity/:id`, … | Investor app (protected) |
| `/staff/login` | Staff login |
| `/staff`, `/staff/clients`, `/staff/tickets`, `/staff/community`, … | Staff console (staff role required) |

---

## Naming in `package.json`

The npm package name is still `fintech-temp`; you may rename it to match the product (for example `yieldvest`) when publishing or splitting packages.
