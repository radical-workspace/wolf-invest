-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE roi_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_performance ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can update all users" ON users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Allow user creation during signup" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Portfolios table policies
CREATE POLICY "Users can view own portfolio" ON portfolios
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own portfolio" ON portfolios
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all portfolios" ON portfolios
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can update all portfolios" ON portfolios
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Allow portfolio creation for authenticated users" ON portfolios
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Transactions table policies
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all transactions" ON transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Deposits table policies
CREATE POLICY "Users can view own deposits" ON deposits
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own deposits" ON deposits
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can manage all deposits" ON deposits
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Withdrawals table policies
CREATE POLICY "Users can view own withdrawals" ON withdrawals
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own withdrawals" ON withdrawals
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can manage all withdrawals" ON withdrawals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Investments table policies
CREATE POLICY "Users can view own investments" ON investments
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own investments" ON investments
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can manage all investments" ON investments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Investment plans table policies (public read, admin write)
CREATE POLICY "Anyone can view investment plans" ON investment_plans
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage investment plans" ON investment_plans
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('admin', 'super_admin')
        )
    );

-- ROI payouts table policies
CREATE POLICY "Users can view own roi payouts" ON roi_payouts
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can manage all roi payouts" ON roi_payouts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Referrals table policies
CREATE POLICY "Users can view own referrals" ON referrals
    FOR SELECT USING (
        auth.uid()::text = referrer_id::text 
        OR auth.uid()::text = referred_id::text
    );

CREATE POLICY "Users can create referrals" ON referrals
    FOR INSERT WITH CHECK (auth.uid()::text = referrer_id::text);

CREATE POLICY "Admins can manage all referrals" ON referrals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Notifications table policies
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can manage all notifications" ON notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Admin settings table policies (admin only)
CREATE POLICY "Admins can manage admin settings" ON admin_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Audit logs table policies (admin read only)
CREATE POLICY "Admins can view audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "System can create audit logs" ON audit_logs
    FOR INSERT WITH CHECK (true);

-- Platform performance table policies (admin only)
CREATE POLICY "Admins can manage platform performance" ON platform_performance
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Create function to automatically create user profile and portfolio
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, plan)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 'user', 'basic');
  
  INSERT INTO public.portfolios (user_id, current_value, total_invested, total_profit_loss, daily_roi)
  VALUES (new.id, 0.00, 0.00, 0.00, 0.00);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to generate referral codes
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS trigger AS $$
BEGIN
  NEW.referral_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for referral code generation
DROP TRIGGER IF EXISTS generate_referral_code_trigger ON users;
CREATE TRIGGER generate_referral_code_trigger
  BEFORE INSERT ON users
  FOR EACH ROW EXECUTE PROCEDURE generate_referral_code();
