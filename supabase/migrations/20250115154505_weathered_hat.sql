/*
  # Add Premium Features

  1. New Tables
    - `chapters`
      - `id` (uuid, primary key)
      - `subject_id` (uuid, foreign key)
      - `name` (text)
      - `description` (text)
      - `order` (integer)
    
    - `subjects`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `icon` (text)

    - `test_types`
      - `id` (uuid, primary key)
      - `name` (text) - 'chapter' or 'subject'
      - `price` (integer) - in paise (7₹ = 700 paise)
      - `attempts_allowed` (integer)

    - `purchases`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `test_id` (uuid, foreign key)
      - `amount_paid` (integer)
      - `attempts_remaining` (integer)
      - `valid_until` (timestamptz)

  2. Changes to existing tables
    - Add to `tests` table:
      - `type_id` (uuid, foreign key)
      - `chapter_id` (uuid, foreign key, nullable)
      - `subject_id` (uuid, foreign key, nullable)
      - `is_free` (boolean)
      - `requires_zen_mode` (boolean)

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Create new tables
CREATE TABLE subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE test_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price integer NOT NULL,
  attempts_allowed integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  test_id uuid REFERENCES tests(id),
  amount_paid integer NOT NULL,
  attempts_remaining integer NOT NULL,
  valid_until timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Add new columns to tests table
ALTER TABLE tests 
ADD COLUMN type_id uuid REFERENCES test_types(id),
ADD COLUMN chapter_id uuid REFERENCES chapters(id),
ADD COLUMN subject_id uuid REFERENCES subjects(id),
ADD COLUMN is_free boolean DEFAULT false,
ADD COLUMN requires_zen_mode boolean DEFAULT false;

-- Enable RLS
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Policies for subjects
CREATE POLICY "Anyone can view subjects"
  ON subjects FOR SELECT
  TO authenticated
  USING (true);

-- Policies for chapters
CREATE POLICY "Anyone can view chapters"
  ON chapters FOR SELECT
  TO authenticated
  USING (true);

-- Policies for test_types
CREATE POLICY "Anyone can view test types"
  ON test_types FOR SELECT
  TO authenticated
  USING (true);

-- Policies for purchases
CREATE POLICY "Users can view own purchases"
  ON purchases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create purchases"
  ON purchases FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert default test types
INSERT INTO test_types (name, price, attempts_allowed) VALUES
  ('chapter', 700, 2),    -- 7₹ for chapter tests, 2 attempts
  ('subject', 1500, 1);   -- 15₹ for subject tests, 1 attempt