-- ============================================================
-- Staff CRM Migration
-- Run this AFTER schema.sql has been applied
-- ============================================================

-- 1. Add role column to profiles (existing users become 'investor')
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'investor'
  CHECK (role IN ('investor', 'staff'));

-- 2. Priority set by RM (null = unset)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT NULL
  CHECK (priority IN ('high', 'medium', 'low'));

-- 3. Index for staff queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 4. Staff notes table
CREATE TABLE IF NOT EXISTS staff_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE staff_notes ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_staff_notes_client ON staff_notes(client_id);

-- 5. Extend tickets table
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES profiles(id);
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS resolution_notes TEXT;

-- 6. Community moderation columns
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT FALSE;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS hidden_by UUID REFERENCES profiles(id);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS hidden_at TIMESTAMPTZ;

-- 7. Staff-aware RLS policies
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'staff'
  );
$$;

REVOKE ALL ON FUNCTION public.is_staff() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated;

-- Profiles (staff can read/update all profiles)
DROP POLICY IF EXISTS profiles_select_own ON profiles;
DROP POLICY IF EXISTS profiles_update_own ON profiles;
DROP POLICY IF EXISTS profiles_select_self_or_staff ON profiles;
DROP POLICY IF EXISTS profiles_update_self_or_staff ON profiles;

CREATE POLICY profiles_select_self_or_staff
  ON profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.is_staff());

CREATE POLICY profiles_update_self_or_staff
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid() OR public.is_staff())
  WITH CHECK (
    (id = auth.uid() AND COALESCE(role, 'investor') = 'investor')
    OR public.is_staff()
  );

-- Investments (staff can manage all)
DROP POLICY IF EXISTS investments_select_own ON investments;
DROP POLICY IF EXISTS investments_insert_own ON investments;
DROP POLICY IF EXISTS investments_update_own ON investments;
DROP POLICY IF EXISTS investments_delete_own ON investments;
DROP POLICY IF EXISTS investments_select_own_or_staff ON investments;
DROP POLICY IF EXISTS investments_insert_own_or_staff ON investments;
DROP POLICY IF EXISTS investments_update_own_or_staff ON investments;
DROP POLICY IF EXISTS investments_delete_own_or_staff ON investments;

CREATE POLICY investments_select_own_or_staff
  ON investments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_staff());

CREATE POLICY investments_insert_own_or_staff
  ON investments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.is_staff());

CREATE POLICY investments_update_own_or_staff
  ON investments
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_staff())
  WITH CHECK (user_id = auth.uid() OR public.is_staff());

CREATE POLICY investments_delete_own_or_staff
  ON investments
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_staff());

-- Tickets (staff can manage all)
DROP POLICY IF EXISTS tickets_select_own ON tickets;
DROP POLICY IF EXISTS tickets_insert_own ON tickets;
DROP POLICY IF EXISTS tickets_update_own ON tickets;
DROP POLICY IF EXISTS tickets_delete_own ON tickets;
DROP POLICY IF EXISTS tickets_select_own_or_staff ON tickets;
DROP POLICY IF EXISTS tickets_insert_own_or_staff ON tickets;
DROP POLICY IF EXISTS tickets_update_own_or_staff ON tickets;
DROP POLICY IF EXISTS tickets_delete_own_or_staff ON tickets;

CREATE POLICY tickets_select_own_or_staff
  ON tickets
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_staff());

CREATE POLICY tickets_insert_own_or_staff
  ON tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.is_staff());

CREATE POLICY tickets_update_own_or_staff
  ON tickets
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_staff())
  WITH CHECK (user_id = auth.uid() OR public.is_staff());

CREATE POLICY tickets_delete_own_or_staff
  ON tickets
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_staff());

-- Staff notes (only staff can read/write)
DROP POLICY IF EXISTS staff_notes_staff_only_select ON staff_notes;
DROP POLICY IF EXISTS staff_notes_staff_only_insert ON staff_notes;
DROP POLICY IF EXISTS staff_notes_staff_only_update ON staff_notes;
DROP POLICY IF EXISTS staff_notes_staff_only_delete ON staff_notes;

CREATE POLICY staff_notes_staff_only_select
  ON staff_notes
  FOR SELECT
  TO authenticated
  USING (public.is_staff());

CREATE POLICY staff_notes_staff_only_insert
  ON staff_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

CREATE POLICY staff_notes_staff_only_update
  ON staff_notes
  FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY staff_notes_staff_only_delete
  ON staff_notes
  FOR DELETE
  TO authenticated
  USING (public.is_staff());

-- Community moderation (staff can manage all posts/comments)
DROP POLICY IF EXISTS community_posts_update_own ON community_posts;
DROP POLICY IF EXISTS community_posts_delete_own ON community_posts;
DROP POLICY IF EXISTS community_posts_update_own_or_staff ON community_posts;
DROP POLICY IF EXISTS community_posts_delete_own_or_staff ON community_posts;

CREATE POLICY community_posts_update_own_or_staff
  ON community_posts
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_staff())
  WITH CHECK (user_id = auth.uid() OR public.is_staff());

CREATE POLICY community_posts_delete_own_or_staff
  ON community_posts
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_staff());

DROP POLICY IF EXISTS community_comments_update_own ON community_comments;
DROP POLICY IF EXISTS community_comments_delete_own ON community_comments;
DROP POLICY IF EXISTS community_comments_update_own_or_staff ON community_comments;
DROP POLICY IF EXISTS community_comments_delete_own_or_staff ON community_comments;

CREATE POLICY community_comments_update_own_or_staff
  ON community_comments
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_staff())
  WITH CHECK (user_id = auth.uid() OR public.is_staff());

CREATE POLICY community_comments_delete_own_or_staff
  ON community_comments
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_staff());
