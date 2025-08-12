-- Wolv-Invest Platform - Sample Data for Testing (Optional)

-- Note: This script is for development/testing purposes only
-- DO NOT run this in production

-- Insert sample transactions for testing
DO $$
DECLARE
    sample_user_id UUID := '00000000-0000-0000-0000-000000000002';
    sample_portfolio_id UUID;
BEGIN
    -- Get the portfolio ID for the sample user
    SELECT id INTO sample_portfolio_id FROM public.portfolios WHERE user_id = sample_user_id;
    
    IF sample_portfolio_id IS NOT NULL THEN
        -- Insert sample deposit transaction
        INSERT INTO public.transactions (
            user_id, portfolio_id, type, amount, fee, net_amount, 
            status, description, reference_id, payment_method
        ) VALUES (
            sample_user_id, sample_portfolio_id, 'deposit', 1000.00, 0.00, 1000.00,
            'completed', 'Initial deposit', 'DEP001', 'crypto'
        );
        
        -- Insert sample investment transaction
        INSERT INTO public.transactions (
            user_id, portfolio_id, type, amount, fee, net_amount,
            status, description, reference_id
        ) VALUES (
            sample_user_id, sample_portfolio_id, 'investment', 500.00, 0.00, 500.00,
            'completed', 'Investment in Basic Plan', 'INV001'
        );
        
        -- Insert sample ROI payout transaction
        INSERT INTO public.transactions (
            user_id, portfolio_id, type, amount, fee, net_amount,
            status, description, reference_id
        ) VALUES (
            sample_user_id, sample_portfolio_id, 'roi_payout', 15.00, 0.00, 15.00,
            'completed', 'Daily ROI payout', 'ROI001'
        );
        
        -- Update portfolio with sample data
        UPDATE public.portfolios SET
            current_balance = 515.00,
            total_invested = 500.00,
            total_profit = 15.00,
            available_balance = 515.00,
            daily_roi = 3.00,
            updated_at = NOW()
        WHERE user_id = sample_user_id;
    END IF;
END $$;

-- Insert sample notifications
INSERT INTO public.notifications (user_id, title, message, type) VALUES
('00000000-0000-0000-0000-000000000002', 'Welcome to Wolv-Invest!', 'Thank you for joining our investment platform. Start your journey to financial freedom today!', 'success'),
('00000000-0000-0000-0000-000000000002', 'Investment Activated', 'Your Basic Plan investment of $500 has been activated and will start generating returns.', 'info'),
('00000000-0000-0000-0000-000000000002', 'ROI Payout Received', 'You have received a daily ROI payout of $15.00 to your account.', 'success');

-- Insert sample investment
DO $$
DECLARE
    sample_user_id UUID := '00000000-0000-0000-0000-000000000002';
    basic_plan_id UUID;
    sample_transaction_id UUID;
BEGIN
    -- Get the basic plan ID
    SELECT id INTO basic_plan_id FROM public.investment_plans WHERE name = 'Basic Plan';
    
    -- Get a sample transaction ID
    SELECT id INTO sample_transaction_id FROM public.transactions 
    WHERE user_id = sample_user_id AND type = 'investment' LIMIT 1;
    
    IF basic_plan_id IS NOT NULL AND sample_transaction_id IS NOT NULL THEN
        INSERT INTO public.investments (
            user_id, plan_id, transaction_id, amount, daily_roi,
            total_expected_return, status, start_date, end_date, next_payout_date
        ) VALUES (
            sample_user_id, basic_plan_id, sample_transaction_id, 500.00, 3.00,
            605.00, 'active', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '1 day'
        );
    END IF;
END $$;

-- Insert sample ROI payout record
DO $$
DECLARE
    sample_user_id UUID := '00000000-0000-0000-0000-000000000002';
    sample_investment_id UUID;
    sample_transaction_id UUID;
BEGIN
    -- Get the sample investment ID
    SELECT id INTO sample_investment_id FROM public.investments WHERE user_id = sample_user_id LIMIT 1;
    
    -- Get the ROI transaction ID
    SELECT id INTO sample_transaction_id FROM public.transactions 
    WHERE user_id = sample_user_id AND type = 'roi_payout' LIMIT 1;
    
    IF sample_investment_id IS NOT NULL AND sample_transaction_id IS NOT NULL THEN
        INSERT INTO public.roi_payouts (
            investment_id, user_id, transaction_id, amount, payout_date, status
        ) VALUES (
            sample_investment_id, sample_user_id, sample_transaction_id, 15.00, CURRENT_DATE, 'paid'
        );
    END IF;
END $$;
