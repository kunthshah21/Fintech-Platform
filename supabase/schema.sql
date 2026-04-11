-- ============================================================
-- YieldVest Database Schema
-- ============================================================

-- 1. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  mobile TEXT,
  dob TEXT,
  referral_code TEXT,
  joined_date DATE DEFAULT CURRENT_DATE,

  -- Investor profile (from onboarding)
  risk_level TEXT CHECK (risk_level IN ('high', 'medium', 'low')),
  investor_quadrant TEXT CHECK (investor_quadrant IN ('cautious-wealthy', 'aggressive', 'aspirational', 'anxious-explorer')),
  tolerance_score INTEGER,
  capacity_score INTEGER,
  sophistication_level INTEGER,
  horizon_level INTEGER,
  investment_goal TEXT,

  -- Portfolio aggregates
  total_invested NUMERIC DEFAULT 0,
  current_value NUMERIC DEFAULT 0,
  total_returns NUMERIC DEFAULT 0,
  return_percent NUMERIC DEFAULT 0,
  active_investments_count INTEGER DEFAULT 0,
  xirr NUMERIC DEFAULT 0,
  wallet_balance NUMERIC DEFAULT 0,

  -- KYC
  kyc_status TEXT DEFAULT 'not_started' CHECK (kyc_status IN ('not_started', 'in_progress', 'pending_verification', 'verified')),
  pan_number TEXT,
  aadhaar_verified BOOLEAN DEFAULT FALSE,
  bank_verified BOOLEAN DEFAULT FALSE,

  -- Onboarding
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_answers JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Investments table
CREATE TABLE IF NOT EXISTS investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  opportunity_id TEXT,
  name TEXT,
  product_type TEXT,
  amount_invested NUMERIC,
  current_value NUMERIC,
  returns_earned NUMERIC DEFAULT 0,
  return_percent NUMERIC DEFAULT 0,
  start_date DATE,
  maturity_date DATE,
  next_repayment DATE,
  status TEXT DEFAULT 'on_track' CHECK (status IN ('on_track', 'delayed', 'matured', 'defaulted')),
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE investments DISABLE ROW LEVEL SECURITY;

-- 3. Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ticket_number TEXT UNIQUE,
  category TEXT,
  subject TEXT,
  description TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tickets DISABLE ROW LEVEL SECURITY;

-- Auto-generate ticket_number as TKT-001, TKT-002, etc.
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 5) AS INTEGER)), 0) + 1
    INTO next_num
    FROM tickets;
  NEW.ticket_number := 'TKT-' || LPAD(next_num::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_ticket_number
  BEFORE INSERT ON tickets
  FOR EACH ROW
  WHEN (NEW.ticket_number IS NULL)
  EXECUTE FUNCTION generate_ticket_number();

-- 4. Watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  opportunity_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

ALTER TABLE watchlist DISABLE ROW LEVEL SECURITY;

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);

-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_investments_updated_at
  BEFORE UPDATE ON investments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
