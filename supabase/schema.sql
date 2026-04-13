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

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

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

ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

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

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

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

ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

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

-- ============================================================
-- 6. Community Posts
-- ============================================================
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  post_type TEXT DEFAULT 'text' CHECK (post_type IN ('text', 'portfolio', 'investment', 'milestone')),
  shared_data JSONB,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- 7. Community Comments
CREATE TABLE IF NOT EXISTS community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

-- 8. Community Likes
CREATE TABLE IF NOT EXISTS community_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_user_id ON community_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_post_id ON community_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_user_id ON community_likes(user_id);

CREATE OR REPLACE TRIGGER trg_community_posts_updated_at
  BEFORE UPDATE ON community_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Likes count sync triggers
CREATE OR REPLACE FUNCTION increment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_community_likes_insert
  AFTER INSERT ON community_likes
  FOR EACH ROW
  EXECUTE FUNCTION increment_likes_count();

CREATE OR REPLACE FUNCTION decrement_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_community_likes_delete
  AFTER DELETE ON community_likes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_likes_count();

-- Comments count sync triggers
CREATE OR REPLACE FUNCTION increment_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_community_comments_insert
  AFTER INSERT ON community_comments
  FOR EACH ROW
  EXECUTE FUNCTION increment_comments_count();

CREATE OR REPLACE FUNCTION decrement_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_community_comments_delete
  AFTER DELETE ON community_comments
  FOR EACH ROW
  EXECUTE FUNCTION decrement_comments_count();

-- ============================================================
-- 9. RLS Policies
-- ============================================================

-- Profiles
DROP POLICY IF EXISTS profiles_select_own ON profiles;
DROP POLICY IF EXISTS profiles_insert_own_investor_profile ON profiles;
DROP POLICY IF EXISTS profiles_update_own ON profiles;

CREATE POLICY profiles_select_own
  ON profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY profiles_insert_own_investor_profile
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY profiles_update_own
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Investments
DROP POLICY IF EXISTS investments_select_own ON investments;
DROP POLICY IF EXISTS investments_insert_own ON investments;
DROP POLICY IF EXISTS investments_update_own ON investments;
DROP POLICY IF EXISTS investments_delete_own ON investments;

CREATE POLICY investments_select_own
  ON investments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY investments_insert_own
  ON investments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY investments_update_own
  ON investments
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY investments_delete_own
  ON investments
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Tickets
DROP POLICY IF EXISTS tickets_select_own ON tickets;
DROP POLICY IF EXISTS tickets_insert_own ON tickets;
DROP POLICY IF EXISTS tickets_update_own ON tickets;
DROP POLICY IF EXISTS tickets_delete_own ON tickets;

CREATE POLICY tickets_select_own
  ON tickets
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY tickets_insert_own
  ON tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY tickets_update_own
  ON tickets
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY tickets_delete_own
  ON tickets
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Watchlist
DROP POLICY IF EXISTS watchlist_select_own ON watchlist;
DROP POLICY IF EXISTS watchlist_insert_own ON watchlist;
DROP POLICY IF EXISTS watchlist_update_own ON watchlist;
DROP POLICY IF EXISTS watchlist_delete_own ON watchlist;

CREATE POLICY watchlist_select_own
  ON watchlist
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY watchlist_insert_own
  ON watchlist
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY watchlist_update_own
  ON watchlist
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY watchlist_delete_own
  ON watchlist
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Community posts
DROP POLICY IF EXISTS community_posts_select_authenticated ON community_posts;
DROP POLICY IF EXISTS community_posts_insert_own ON community_posts;
DROP POLICY IF EXISTS community_posts_update_own ON community_posts;
DROP POLICY IF EXISTS community_posts_delete_own ON community_posts;

CREATE POLICY community_posts_select_authenticated
  ON community_posts
  FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY community_posts_insert_own
  ON community_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY community_posts_update_own
  ON community_posts
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY community_posts_delete_own
  ON community_posts
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Community comments
DROP POLICY IF EXISTS community_comments_select_authenticated ON community_comments;
DROP POLICY IF EXISTS community_comments_insert_own ON community_comments;
DROP POLICY IF EXISTS community_comments_update_own ON community_comments;
DROP POLICY IF EXISTS community_comments_delete_own ON community_comments;

CREATE POLICY community_comments_select_authenticated
  ON community_comments
  FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY community_comments_insert_own
  ON community_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY community_comments_update_own
  ON community_comments
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY community_comments_delete_own
  ON community_comments
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Community likes
DROP POLICY IF EXISTS community_likes_select_authenticated ON community_likes;
DROP POLICY IF EXISTS community_likes_insert_own ON community_likes;
DROP POLICY IF EXISTS community_likes_delete_own ON community_likes;

CREATE POLICY community_likes_select_authenticated
  ON community_likes
  FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY community_likes_insert_own
  ON community_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY community_likes_delete_own
  ON community_likes
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
