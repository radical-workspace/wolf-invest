-- Create users table with additional banking profile fields
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  pin_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accounts table for different account types
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('checking', 'savings', 'investment')),
  account_number TEXT UNIQUE NOT NULL,
  balance DECIMAL(15,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'transfer', 'payment', 'investment')),
  amount DECIMAL(15,2) NOT NULL,
  description TEXT,
  reference_number TEXT UNIQUE,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cards table
CREATE TABLE IF NOT EXISTS public.cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  card_type TEXT NOT NULL CHECK (card_type IN ('debit', 'credit')),
  card_number TEXT UNIQUE NOT NULL,
  card_holder_name TEXT NOT NULL,
  expiry_date DATE NOT NULL,
  cvv TEXT NOT NULL,
  credit_limit DECIMAL(15,2),
  available_credit DECIMAL(15,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create investments table
CREATE TABLE IF NOT EXISTS public.investments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  investment_type TEXT NOT NULL CHECK (investment_type IN ('crypto', 'stocks', 'bonds', 'mutual_funds')),
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  quantity DECIMAL(15,8) NOT NULL,
  purchase_price DECIMAL(15,2) NOT NULL,
  current_price DECIMAL(15,2) NOT NULL,
  total_value DECIMAL(15,2) GENERATED ALWAYS AS (quantity * current_price) STORED,
  profit_loss DECIMAL(15,2) GENERATED ALWAYS AS ((current_price - purchase_price) * quantity) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own accounts" ON public.accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM public.accounts WHERE id = account_id)
);
CREATE POLICY "Users can view own cards" ON public.cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own investments" ON public.investments FOR SELECT USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON public.transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON public.cards(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON public.investments(user_id);
