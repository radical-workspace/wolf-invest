-- Insert sample user data (this will be created when users sign up)
-- Sample accounts for demo purposes
INSERT INTO public.accounts (user_id, account_type, account_number, balance) VALUES
  -- These will be populated when users sign up and create accounts
  ('00000000-0000-0000-0000-000000000000', 'checking', 'CHK-001-2024', 5420.50),
  ('00000000-0000-0000-0000-000000000000', 'savings', 'SAV-001-2024', 12750.00),
  ('00000000-0000-0000-0000-000000000000', 'investment', 'INV-001-2024', 25000.00)
ON CONFLICT (account_number) DO NOTHING;

-- Sample transactions
INSERT INTO public.transactions (account_id, transaction_type, amount, description, reference_number) VALUES
  ((SELECT id FROM public.accounts WHERE account_number = 'CHK-001-2024'), 'deposit', 2500.00, 'Salary Deposit', 'TXN-001-2024'),
  ((SELECT id FROM public.accounts WHERE account_number = 'CHK-001-2024'), 'withdrawal', -150.00, 'ATM Withdrawal', 'TXN-002-2024'),
  ((SELECT id FROM public.accounts WHERE account_number = 'SAV-001-2024'), 'deposit', 1000.00, 'Monthly Savings', 'TXN-003-2024'),
  ((SELECT id FROM public.accounts WHERE account_number = 'CHK-001-2024'), 'payment', -89.99, 'Online Purchase', 'TXN-004-2024')
ON CONFLICT (reference_number) DO NOTHING;

-- Sample investments
INSERT INTO public.investments (user_id, investment_type, symbol, name, quantity, purchase_price, current_price) VALUES
  ('00000000-0000-0000-0000-000000000000', 'crypto', 'BTC', 'Bitcoin', 0.5, 45000.00, 52000.00),
  ('00000000-0000-0000-0000-000000000000', 'crypto', 'ETH', 'Ethereum', 2.0, 3000.00, 3500.00),
  ('00000000-0000-0000-0000-000000000000', 'stocks', 'AAPL', 'Apple Inc.', 10.0, 150.00, 175.00),
  ('00000000-0000-0000-0000-000000000000', 'stocks', 'TSLA', 'Tesla Inc.', 5.0, 800.00, 750.00)
ON CONFLICT DO NOTHING;
