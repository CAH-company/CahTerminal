-- ============================================================
-- CAH Terminal: Supabase Database Setup
-- Copy and paste this SQL into Supabase SQL Editor
-- (Dashboard > SQL Editor > New Query)
-- ============================================================

-- 1. Create transactions table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticker text NOT NULL,
  type text NOT NULL CHECK (type IN ('BUY', 'SELL')),
  quantity numeric NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Add missing columns if table already exists
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS ticker text NOT NULL DEFAULT '';
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'BUY';
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS quantity numeric NOT NULL DEFAULT 0;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS price numeric NOT NULL DEFAULT 0;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

-- 3. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_ticker ON transactions(ticker);

-- 4. Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies (drop and recreate to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 6. Create profiles table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'normal' CHECK (role IN ('normal', 'premium')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 7. Create market_cache table (used by market data refresh)
CREATE TABLE IF NOT EXISTS market_cache (
  ticker text PRIMARY KEY,
  price numeric,
  change numeric,
  change_percent numeric,
  beta numeric,
  market_cap numeric,
  company_name text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE market_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read market cache" ON market_cache;
CREATE POLICY "Anyone can read market cache"
  ON market_cache FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can update market cache" ON market_cache;
CREATE POLICY "Authenticated users can update market cache"
  ON market_cache FOR ALL
  USING (auth.role() = 'authenticated');

-- 8. Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'normal')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
