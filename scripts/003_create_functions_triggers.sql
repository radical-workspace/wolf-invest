-- Wolv-Invest Platform - Database Functions and Triggers

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists BOOLEAN;
BEGIN
    LOOP
        code := 'WLV' || UPPER(substring(md5(random()::text) from 1 for 5));
        SELECT EXISTS(SELECT 1 FROM public.users WHERE referral_code = code) INTO exists;
        IF NOT exists THEN
            EXIT;
        END IF;
    END LOOP;
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique account number
CREATE OR REPLACE FUNCTION generate_account_number()
RETURNS TEXT AS $$
DECLARE
    account_num TEXT;
    exists BOOLEAN;
BEGIN
    LOOP
        account_num := '2024' || LPAD(floor(random() * 1000000)::text, 6, '0');
        SELECT EXISTS(SELECT 1 FROM public.portfolios WHERE account_number = account_num) INTO exists;
        IF NOT exists THEN
            EXIT;
        END IF;
    END LOOP;
    RETURN account_num;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate referral code for new users
CREATE OR REPLACE FUNCTION auto_generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referral_code IS NULL THEN
        NEW.referral_code := generate_referral_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create portfolio for new users
CREATE OR REPLACE FUNCTION create_user_portfolio()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.portfolios (
        user_id,
        account_number,
        current_balance,
        total_invested,
        total_profit,
        total_withdrawn,
        available_balance,
        locked_balance
    ) VALUES (
        NEW.id,
        generate_account_number(),
        0.00,
        0.00,
        0.00,
        0.00,
        0.00,
        0.00
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to log audit trail
CREATE OR REPLACE FUNCTION log_audit_trail()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_values,
        new_values,
        created_at
    ) VALUES (
        COALESCE(NEW.user_id, OLD.user_id),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END,
        NOW()
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS trigger_users_updated_at ON public.users;
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_users_referral_code ON public.users;
CREATE TRIGGER trigger_users_referral_code
    BEFORE INSERT ON public.users
    FOR EACH ROW EXECUTE FUNCTION auto_generate_referral_code();

DROP TRIGGER IF EXISTS trigger_create_portfolio ON public.users;
CREATE TRIGGER trigger_create_portfolio
    AFTER INSERT ON public.users
    FOR EACH ROW EXECUTE FUNCTION create_user_portfolio();

DROP TRIGGER IF EXISTS trigger_portfolios_updated_at ON public.portfolios;
CREATE TRIGGER trigger_portfolios_updated_at
    BEFORE UPDATE ON public.portfolios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_investment_plans_updated_at ON public.investment_plans;
CREATE TRIGGER trigger_investment_plans_updated_at
    BEFORE UPDATE ON public.investment_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit trail triggers for sensitive tables
DROP TRIGGER IF EXISTS trigger_transactions_audit ON public.transactions;
CREATE TRIGGER trigger_transactions_audit
    AFTER INSERT OR UPDATE OR DELETE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

DROP TRIGGER IF EXISTS trigger_withdrawals_audit ON public.withdrawals;
CREATE TRIGGER trigger_withdrawals_audit
    AFTER INSERT OR UPDATE OR DELETE ON public.withdrawals
    FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

DROP TRIGGER IF EXISTS trigger_deposits_audit ON public.deposits;
CREATE TRIGGER trigger_deposits_audit
    AFTER INSERT OR UPDATE OR DELETE ON public.deposits
    FOR EACH ROW EXECUTE FUNCTION log_audit_trail();
