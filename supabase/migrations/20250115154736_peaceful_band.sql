/*
  # Add Analytics and Enhanced Features

  1. New Tables
    - `user_stats`
      - Track user performance and engagement
      - Store test history and analytics
    
    - `test_analytics`
      - Track test performance metrics
      - Store difficulty levels and success rates

    - `payments`
      - Store payment history and transaction details
      - Track payment status and methods

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Create analytics tables
CREATE TABLE user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  tests_taken integer DEFAULT 0,
  tests_passed integer DEFAULT 0,
  total_time_spent integer DEFAULT 0,
  average_score numeric(5,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE test_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid REFERENCES tests(id),
  total_attempts integer DEFAULT 0,
  average_score numeric(5,2) DEFAULT 0,
  completion_rate numeric(5,2) DEFAULT 0,
  average_time_minutes integer DEFAULT 0,
  difficulty_rating numeric(3,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  purchase_id uuid REFERENCES purchases(id),
  amount integer NOT NULL,
  currency text DEFAULT 'INR',
  payment_method text,
  transaction_id text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policies for user_stats
CREATE POLICY "Users can view own stats"
  ON user_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for test_analytics
CREATE POLICY "Anyone can view test analytics"
  ON test_analytics FOR SELECT
  TO authenticated
  USING (true);

-- Policies for payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);