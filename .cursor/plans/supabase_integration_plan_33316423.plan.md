---
name: Supabase Integration Plan
overview: Connect YieldVest to Supabase with proper auth, database schema (profiles, investments, tickets, watchlist tables), and replace all localStorage-based state persistence with Supabase queries.
todos:
  - id: install-deps
    content: Install @supabase/supabase-js and create .env with credentials
    status: completed
  - id: create-client
    content: Create src/lib/supabase.js with Supabase client initialization
    status: completed
  - id: write-schema
    content: Write supabase/schema.sql with all CREATE TABLE statements, indexes, trigger for ticket_number, and DISABLE RLS
    status: completed
  - id: run-schema
    content: Execute the schema SQL against the Supabase project
    status: completed
  - id: refactor-context
    content: "Refactor AppContext.jsx: replace localStorage with Supabase Auth + DB queries for profile, investments, watchlist"
    status: completed
  - id: update-login
    content: Update Login.jsx to use Supabase Auth (signInWithPassword / signUp)
    status: completed
  - id: update-onboarding
    content: Update Onboarding.jsx to persist investor profile data to profiles table
    status: completed
  - id: update-support
    content: Update Support.jsx to read/write tickets from Supabase
    status: completed
  - id: update-profile
    content: Update Profile.jsx to persist profile edits to Supabase
    status: completed
  - id: update-kyc
    content: Update KYC.jsx to persist KYC status changes to Supabase
    status: completed
  - id: update-gitignore
    content: Add .env to .gitignore
    status: completed
isProject: false
---

# Supabase Integration for YieldVest

## Database Schema Design

Four tables linked to Supabase Auth's `auth.users` via `user_id`. RLS is **disabled** on all tables per requirement.

```mermaid
erDiagram
    auth_users ||--|| profiles : "has one"
    profiles ||--o{ investments : "has many"
    profiles ||--o{ tickets : "has many"
    profiles ||--o{ watchlist : "has many"

    profiles {
        uuid id PK "FK to auth.users.id"
        text name
        text email
        text mobile
        text dob
        text referral_code
        date joined_date
        text risk_level "high / medium / low"
        text investor_quadrant "cautious-wealthy / aggressive / aspirational / anxious-explorer"
        int tolerance_score
        int capacity_score
        int sophistication_level
        int horizon_level
        text investment_goal
        numeric total_invested "default 0"
        numeric current_value "default 0"
        numeric total_returns "default 0"
        numeric return_percent "default 0"
        int active_investments_count "default 0"
        numeric xirr "default 0"
        numeric wallet_balance "default 0"
        text kyc_status "not_started / in_progress / pending_verification / verified"
        text pan_number
        boolean aadhaar_verified "default false"
        boolean bank_verified "default false"
        boolean onboarding_completed "default false"
        jsonb onboarding_answers "raw onboarding responses"
        timestamptz created_at
        timestamptz updated_at
    }

    investments {
        uuid id PK
        uuid user_id FK
        text opportunity_id
        text name
        text product_type
        numeric amount_invested
        numeric current_value
        numeric returns_earned
        numeric return_percent
        date start_date
        date maturity_date
        date next_repayment
        text status "on_track / delayed / matured / defaulted"
        text payment_method
        timestamptz created_at
        timestamptz updated_at
    }

    tickets {
        uuid id PK
        uuid user_id FK
        text ticket_number "TKT-001 style, auto-generated"
        text category
        text subject
        text description
        text status "open / in_progress / resolved / closed"
        timestamptz created_at
        timestamptz updated_at
    }

    watchlist {
        uuid id PK
        uuid user_id FK
        text opportunity_id
        timestamptz created_at
    }
```

### Key design decisions

- **`profiles`** is the single source of truth for user data -- it stores both identity info (name, email, mobile, dob) and computed portfolio aggregates (total_invested, current_value, etc.) plus investor profile data derived from onboarding (risk_level, quadrant, scores)
- **`risk_level`** is derived from `investor_quadrant`: aggressive = high, cautious-wealthy = medium, anxious-explorer/aspirational = low -- stored explicitly for easy querying
- **`investments`** stores every individual investment record; portfolio aggregates in `profiles` are updated when investments are created
- **`tickets`** stores support tickets with auto-incrementing `ticket_number` (via a DB function)
- **`watchlist`** is a simple junction table for opportunity bookmarks
- **`onboarding_answers`** stored as JSONB so the raw onboarding data is preserved for future re-computation

---

## Files to Create

### 1. `.env` -- Supabase credentials

```
VITE_SUPABASE_URL=https://oomkjuzjyccfhtguuytp.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_SQSBapi7Qhfhd1sl0_AANA_37dIr4SN
SUPABASE_SECRET_KEY=sb_secret_hdA8LX1JN0aNrrHiaCiqAQ_cxLwWUSP
```

### 2. `src/lib/supabase.js` -- Supabase client initialization

Create the Supabase client using `@supabase/supabase-js` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from `import.meta.env`.

### 3. `supabase/schema.sql` -- Full SQL migration

All `CREATE TABLE` statements, ticket number generation function + trigger, indexes on `user_id` columns, and `ALTER TABLE ... DISABLE ROW LEVEL SECURITY` for every table.

---

## Files to Modify

### 4. [package.json](package.json) -- Add `@supabase/supabase-js` dependency

### 5. [.gitignore](.gitignore) -- Add `.env` to prevent committing secrets

### 6. [src/context/AppContext.jsx](src/context/AppContext.jsx) -- Major refactor

This is the biggest change. Replace localStorage persistence with Supabase:

- **Auth**: Replace mock `login()` / `registerNewUser()` / `loginWithDigiLocker()` / `logout()` with Supabase Auth (`supabase.auth.signUp`, `signInWithPassword`, `signOut`)
- **Session**: Use `supabase.auth.onAuthStateChange` to detect login/logout and load profile + investments from DB
- **Profile loading**: On auth, fetch from `profiles` table; if new user, insert a row
- **`createInvestment`**: Insert into `investments` table and update `profiles` aggregates
- **Watchlist**: CRUD against `watchlist` table
- **State init**: Fetch `investments`, `watchlist`, `tickets` from Supabase on login instead of from `mockData.js`

### 7. [src/pages/Login.jsx](src/pages/Login.jsx)

- Replace mock credential check with `supabase.auth.signInWithPassword({ email, password })`
- Replace DigiLocker mock with appropriate Supabase signup flow
- Handle Supabase auth errors (invalid credentials, email not confirmed, etc.)

### 8. [src/pages/Onboarding.jsx](src/pages/Onboarding.jsx)

- After onboarding answers are collected, update the `profiles` row with investor profile data (quadrant, risk_level, scores, onboarding_completed = true)

### 9. [src/pages/Support.jsx](src/pages/Support.jsx)

- Replace `mockTickets` with a Supabase query (`select * from tickets where user_id = ...`)
- Wire "Raise a Ticket" form submit to insert into `tickets` table

### 10. [src/pages/Profile.jsx](src/pages/Profile.jsx)

- Wire profile edit (name, email, mobile, dob) to update `profiles` table

### 11. [src/pages/KYC.jsx](src/pages/KYC.jsx)

- Update KYC status changes to persist to `profiles.kyc_status`, `pan_number`, `aadhaar_verified`, `bank_verified`

---

## Implementation Order

The work follows a dependency chain: schema first, then client, then auth, then data operations.
