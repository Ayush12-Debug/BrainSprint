/*
  # Initial Schema for BrainSprint

  1. New Tables
    - `users`
      - Extended user profile data
      - Linked to Supabase auth
    - `tests`
      - Test information and settings
    - `questions`
      - Test questions with multiple choice options
    - `attempts`
      - User test attempts and scores
    - `answers`
      - User answers for each question

  2. Security
    - RLS enabled on all tables
    - Policies for user data protection
*/

-- Users table for extended profile data
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tests table
CREATE TABLE IF NOT EXISTS tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  duration_minutes integer NOT NULL DEFAULT 30,
  passing_score integer NOT NULL DEFAULT 70,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid REFERENCES tests(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  options jsonb NOT NULL,
  correct_answer text NOT NULL,
  points integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Test attempts
CREATE TABLE IF NOT EXISTS attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  test_id uuid REFERENCES tests(id),
  score integer,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  status text DEFAULT 'in_progress'
);

-- User answers
CREATE TABLE IF NOT EXISTS answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid REFERENCES attempts(id) ON DELETE CASCADE,
  question_id uuid REFERENCES questions(id),
  selected_answer text,
  is_correct boolean,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Tests policies
CREATE POLICY "Anyone can view tests"
  ON tests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create tests"
  ON tests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Questions policies
CREATE POLICY "Anyone can view questions"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

-- Attempts policies
CREATE POLICY "Users can view own attempts"
  ON attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create attempts"
  ON attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Answers policies
CREATE POLICY "Users can manage own answers"
  ON answers FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM attempts 
      WHERE attempts.id = answers.attempt_id
    )
  );