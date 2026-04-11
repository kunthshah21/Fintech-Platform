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

ALTER TABLE staff_notes DISABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_staff_notes_client ON staff_notes(client_id);

-- 5. Extend tickets table
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES profiles(id);
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS resolution_notes TEXT;

-- 6. Community moderation columns
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT FALSE;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS hidden_by UUID REFERENCES profiles(id);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS hidden_at TIMESTAMPTZ;
