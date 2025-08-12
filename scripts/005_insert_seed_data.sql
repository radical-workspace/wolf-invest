-- Wolv-Invest Platform - Seed Data

-- Insert investment plans
INSERT INTO public.investment_plans (name, description, min_amount, max_amount, daily_roi_min, daily_roi_max, duration_days, withdrawal_period_days, features) VALUES
('Basic Plan', 'Perfect for beginners looking to explore crypto investments. Offers steady returns with minimal risk.', 200.00, 999.00, 2.00, 3.00, 7, 20, '["Basic educational resources", "Email support", "Daily ROI tracking"]'),
('Amateur Plan', 'Designed for intermediate investors seeking higher returns. Includes additional benefits and support.', 1000.00, 1999.00, 3.00, 4.00, 7, 20, '["Exclusive webinars", "Expert advice", "Priority support", "Advanced analytics"]'),
('Retirement Plan', 'Tailored for long-term investors. Focused on securing financial stability for the future.', 2000.00, 9999.00, 4.00, 5.00, 7, 20, '["Personalized financial planning", "Dedicated account manager", "Loan services eligibility", "Retirement planning tools"]'),
('VIP Plan', 'Exclusive benefits for high-value investors. Premium features and personalized service.', 10000.00, 999999.00, 4.50, 5.50, 7, 20, '["Personal investment advisor", "VIP customer support", "Exclusive investment opportunities", "Premium analytics dashboard", "Priority withdrawals"]');

-- Insert admin settings
INSERT INTO public.admin_settings (key, value, description, category, is_public) VALUES
('platform_name', '"Wolv-Invest"', 'Platform name', 'branding', true),
('platform_description', '"Professional crypto investment platform offering competitive returns"', 'Platform description', 'branding', true),
('support_email', '"support@wolv.pro"', 'Support email address', 'contact', true),
('minimum_withdrawal', '50.00', 'Minimum withdrawal amount', 'limits', false),
('maximum_withdrawal_daily', '10000.00', 'Maximum daily withdrawal limit', 'limits', false),
('withdrawal_fee_percentage', '2.5', 'Withdrawal fee percentage', 'fees', false),
('referral_bonus_percentage', '5.0', 'Referral bonus percentage', 'referrals', false),
('kyc_required_amount', '1000.00', 'Amount threshold requiring KYC verification', 'compliance', false),
('maintenance_mode', 'false', 'Platform maintenance mode status', 'system', false),
('registration_enabled', 'true', 'New user registration enabled', 'system', false);

-- Insert sample admin user (you should change these credentials)
INSERT INTO public.users (
    id,
    email, 
    full_name, 
    role, 
    status, 
    kyc_status,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin@wolv.pro',
    'System Administrator',
    'super_admin',
    'active',
    'verified',
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert sample regular user for testing
INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    status,
    kyc_status,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000002',
    'user@wolv.pro',
    'Test User',
    'user',
    'active',
    'pending',
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert initial platform performance record
INSERT INTO public.platform_performance (
    date,
    total_users,
    active_users,
    total_investments,
    total_withdrawals,
    total_deposits,
    total_roi_paid,
    platform_balance,
    metrics
) VALUES (
    CURRENT_DATE,
    0,
    0,
    0.00,
    0.00,
    0.00,
    0.00,
    0.00,
    '{"new_registrations": 0, "active_investments": 0, "pending_withdrawals": 0}'
) ON CONFLICT (date) DO NOTHING;
