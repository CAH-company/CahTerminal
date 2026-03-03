-- ============================================================
-- Supabase Migration: Fix transactions table schema
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL)
-- ============================================================

-- Add missing 'quantity' column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'quantity'
  ) THEN
    ALTER TABLE transactions ADD COLUMN quantity numeric NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Add missing 'created_at' column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE transactions ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;

-- Ensure other required columns exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'ticker'
  ) THEN
    ALTER TABLE transactions ADD COLUMN ticker text NOT NULL DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'type'
  ) THEN
    ALTER TABLE transactions ADD COLUMN type text NOT NULL DEFAULT 'BUY';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'price'
  ) THEN
    ALTER TABLE transactions ADD COLUMN price numeric NOT NULL DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE transactions ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Enable Row Level Security if not already enabled
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policy so users can only see their own transactions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'transactions' AND policyname = 'Users can view own transactions'
  ) THEN
    CREATE POLICY "Users can view own transactions"
      ON transactions FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'transactions' AND policyname = 'Users can insert own transactions'
  ) THEN
    CREATE POLICY "Users can insert own transactions"
      ON transactions FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
