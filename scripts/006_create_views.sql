-- Wolv-Invest Platform - Database Views for Reporting

-- User dashboard summary view
CREATE OR REPLACE VIEW user_dashboard_summary AS
SELECT 
    u.id as user_id,
    u.full_name,
    u.email,
    u.status as user_status,
    u.kyc_status,
    p.current_balance,
    p.total_invested,
    p.total_profit,
    p.total_withdrawn,
    p.available_balance,
    p.locked_balance,
    p.account_number,
    ip.name as current_plan,
    ip.daily_roi_min,
    ip.daily_roi_max,
    (SELECT COUNT(*) FROM public.investments WHERE user_id = u.id AND status = 'active') as active_investments,
    (SELECT COUNT(*) FROM public.transactions WHERE user_id = u.id AND created_at >= CURRENT_DATE - INTERVAL '30 days') as recent_transactions,
    (SELECT COUNT(*) FROM public.notifications WHERE user_id = u.id AND is_read = false) as unread_notifications
FROM public.users u
LEFT JOIN public.portfolios p ON u.id = p.user_id
LEFT JOIN public.investment_plans ip ON p.plan_id = ip.id;

-- Admin dashboard statistics view
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM public.users WHERE role = 'user') as total_users,
    (SELECT COUNT(*) FROM public.users WHERE role = 'user' AND created_at >= CURRENT_DATE - INTERVAL '30 days') as new_users_this_month,
    (SELECT COUNT(*) FROM public.users WHERE role = 'user' AND last_login >= CURRENT_DATE - INTERVAL '7 days') as active_users_week,
    (SELECT COALESCE(SUM(current_balance), 0) FROM public.portfolios) as total_platform_balance,
    (SELECT COALESCE(SUM(total_invested), 0) FROM public.portfolios) as total_investments,
    (SELECT COALESCE(SUM(total_profit), 0) FROM public.portfolios) as total_profits_paid,
    (SELECT COALESCE(SUM(total_withdrawn), 0) FROM public.portfolios) as total_withdrawals,
    (SELECT COUNT(*) FROM public.transactions WHERE status = 'pending') as pending_transactions,
    (SELECT COUNT(*) FROM public.withdrawals WHERE status = 'pending') as pending_withdrawals,
    (SELECT COUNT(*) FROM public.deposits WHERE status = 'pending') as pending_deposits,
    (SELECT COUNT(*) FROM public.investments WHERE status = 'active') as active_investments;

-- Transaction summary view
CREATE OR REPLACE VIEW transaction_summary AS
SELECT 
    t.id,
    t.user_id,
    u.full_name as user_name,
    u.email as user_email,
    t.type,
    t.amount,
    t.fee,
    t.net_amount,
    t.status,
    t.description,
    t.reference_id,
    t.payment_method,
    t.created_at,
    t.processed_at,
    CASE 
        WHEN t.processed_by IS NOT NULL THEN pu.full_name 
        ELSE NULL 
    END as processed_by_name
FROM public.transactions t
JOIN public.users u ON t.user_id = u.id
LEFT JOIN public.users pu ON t.processed_by = pu.id;

-- Investment performance view
CREATE OR REPLACE VIEW investment_performance AS
SELECT 
    i.id,
    i.user_id,
    u.full_name as user_name,
    u.email as user_email,
    ip.name as plan_name,
    i.amount as invested_amount,
    i.daily_roi,
    i.total_expected_return,
    i.total_paid_return,
    i.status,
    i.start_date,
    i.end_date,
    i.next_payout_date,
    CASE 
        WHEN i.status = 'active' THEN 
            GREATEST(0, DATE_PART('day', i.end_date - CURRENT_DATE))
        ELSE 0 
    END as days_remaining,
    CASE 
        WHEN i.total_expected_return > 0 THEN 
            ROUND((i.total_paid_return / i.total_expected_return * 100), 2)
        ELSE 0 
    END as completion_percentage
FROM public.investments i
JOIN public.users u ON i.user_id = u.id
JOIN public.investment_plans ip ON i.plan_id = ip.id;

-- Referral summary view
CREATE OR REPLACE VIEW referral_summary AS
SELECT 
    r.referrer_id,
    referrer.full_name as referrer_name,
    referrer.email as referrer_email,
    COUNT(r.referred_id) as total_referrals,
    COUNT(CASE WHEN r.status = 'active' THEN 1 END) as active_referrals,
    COALESCE(SUM(r.bonus_amount), 0) as total_bonus_earned,
    COALESCE(SUM(CASE WHEN r.status = 'paid' THEN r.bonus_amount ELSE 0 END), 0) as total_bonus_paid
FROM public.referrals r
JOIN public.users referrer ON r.referrer_id = referrer.id
GROUP BY r.referrer_id, referrer.full_name, referrer.email;

-- Daily platform metrics view
CREATE OR REPLACE VIEW daily_platform_metrics AS
SELECT 
    DATE(created_at) as date,
    COUNT(CASE WHEN type = 'deposit' AND status = 'completed' THEN 1 END) as daily_deposits_count,
    COALESCE(SUM(CASE WHEN type = 'deposit' AND status = 'completed' THEN amount ELSE 0 END), 0) as daily_deposits_amount,
    COUNT(CASE WHEN type = 'withdrawal' AND status = 'completed' THEN 1 END) as daily_withdrawals_count,
    COALESCE(SUM(CASE WHEN type = 'withdrawal' AND status = 'completed' THEN amount ELSE 0 END), 0) as daily_withdrawals_amount,
    COUNT(CASE WHEN type = 'investment' AND status = 'completed' THEN 1 END) as daily_investments_count,
    COALESCE(SUM(CASE WHEN type = 'investment' AND status = 'completed' THEN amount ELSE 0 END), 0) as daily_investments_amount,
    COUNT(CASE WHEN type = 'roi_payout' AND status = 'completed' THEN 1 END) as daily_roi_payouts_count,
    COALESCE(SUM(CASE WHEN type = 'roi_payout' AND status = 'completed' THEN amount ELSE 0 END), 0) as daily_roi_payouts_amount
FROM public.transactions
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- User activity summary view
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT 
    u.id as user_id,
    u.full_name,
    u.email,
    u.created_at as registration_date,
    u.last_login,
    p.current_balance,
    p.total_invested,
    p.total_profit,
    (SELECT COUNT(*) FROM public.transactions WHERE user_id = u.id) as total_transactions,
    (SELECT COUNT(*) FROM public.investments WHERE user_id = u.id) as total_investments_count,
    (SELECT COUNT(*) FROM public.referrals WHERE referrer_id = u.id) as total_referrals,
    CASE 
        WHEN u.last_login >= CURRENT_DATE - INTERVAL '7 days' THEN 'Active'
        WHEN u.last_login >= CURRENT_DATE - INTERVAL '30 days' THEN 'Inactive'
        ELSE 'Dormant'
    END as activity_status
FROM public.users u
LEFT JOIN public.portfolios p ON u.id = p.user_id
WHERE u.role = 'user';
