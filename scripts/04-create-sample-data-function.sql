-- Function to create sample data for a new user
CREATE OR REPLACE FUNCTION create_sample_data_for_user(user_id UUID)
RETURNS VOID AS $$
DECLARE
  checking_account_id UUID;
  savings_account_id UUID;
  investment_account_id UUID;
BEGIN
  -- Create sample accounts
  INSERT INTO public.accounts (user_id, account_type, account_number, balance)
  VALUES 
    (user_id, 'checking', 'CHK-' || EXTRACT(EPOCH FROM NOW())::TEXT || '-' || LEFT(user_id::TEXT, 8), 5420.50),
    (user_id, 'savings', 'SAV-' || EXTRACT(EPOCH FROM NOW())::TEXT || '-' || LEFT(user_id::TEXT, 8), 12750.00),
    (user_id, 'investment', 'INV-' || EXTRACT(EPOCH FROM NOW())::TEXT || '-' || LEFT(user_id::TEXT, 8), 25000.00)
  RETURNING id INTO checking_account_id;

  -- Get account IDs
  SELECT id INTO checking_account_id FROM public.accounts WHERE user_id = user_id AND account_type = 'checking' LIMIT 1;
  SELECT id INTO savings_account_id FROM public.accounts WHERE user_id = user_id AND account_type = 'savings' LIMIT 1;
  SELECT id INTO investment_account_id FROM public.accounts WHERE user_id = user_id AND account_type = 'investment' LIMIT 1;

  -- Create sample transactions
  INSERT INTO public.transactions (account_id, transaction_type, amount, description, reference_number)
  VALUES 
    (checking_account_id, 'deposit', 2500.00, 'Salary Deposit', 'TXN-' || EXTRACT(EPOCH FROM NOW())::TEXT || '-001'),
    (checking_account_id, 'withdrawal', -150.00, 'ATM Withdrawal', 'TXN-' || EXTRACT(EPOCH FROM NOW())::TEXT || '-002'),
    (savings_account_id, 'deposit', 1000.00, 'Monthly Savings', 'TXN-' || EXTRACT(EPOCH FROM NOW())::TEXT || '-003'),
    (checking_account_id, 'payment', -89.99, 'Online Purchase', 'TXN-' || EXTRACT(EPOCH FROM NOW())::TEXT || '-004');

  -- Create sample cards
  INSERT INTO public.cards (user_id, account_id, card_type, card_number, card_holder_name, expiry_date, cvv, credit_limit, available_credit)
  VALUES 
    (user_id, checking_account_id, 'debit', '4532' || LPAD(FLOOR(RANDOM() * 1000000000000)::TEXT, 12, '0'), 'CARD HOLDER', CURRENT_DATE + INTERVAL '3 years', '123', NULL, NULL),
    (user_id, checking_account_id, 'credit', '5555' || LPAD(FLOOR(RANDOM() * 1000000000000)::TEXT, 12, '0'), 'CARD HOLDER', CURRENT_DATE + INTERVAL '3 years', '456', 5000.00, 4500.00);

  -- Create sample investments
  INSERT INTO public.investments (user_id, investment_type, symbol, name, quantity, purchase_price, current_price)
  VALUES 
    (user_id, 'crypto', 'BTC', 'Bitcoin', 0.5, 45000.00, 52000.00),
    (user_id, 'crypto', 'ETH', 'Ethereum', 2.0, 3000.00, 3500.00),
    (user_id, 'stocks', 'AAPL', 'Apple Inc.', 10.0, 150.00, 175.00),
    (user_id, 'stocks', 'TSLA', 'Tesla Inc.', 5.0, 800.00, 750.00);

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
