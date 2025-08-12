-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    current_value NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    daily_roi NUMERIC(5, 4) NOT NULL DEFAULT 0.00,
    total_profit_loss NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    asset_allocation JSONB DEFAULT '[]'::jsonb, -- Store as JSONB for flexibility
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- e.g., 'Deposit', 'Investment', 'Withdrawal'
    amount NUMERIC(18, 2) NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL -- e.g., 'Completed', 'Pending', 'Failed'
);

-- Seed some initial data for demonstration
INSERT INTO users (id, email, role)
VALUES ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'user@example.com', 'user')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, role)
VALUES ('b2c3d4e5-f6a7-8901-2345-67890abcdef0', 'admin@example.com', 'admin')
ON CONFLICT (id) DO NOTHING;

INSERT INTO portfolios (user_id, current_value, daily_roi, total_profit_loss, asset_allocation)
VALUES (
    'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    15230.50,
    0.035,
    2150.75,
    '[{"name": "Bitcoin", "percentage": 40}, {"name": "Ethereum", "percentage": 30}, {"name": "Gold", "percentage": 20}, {"name": "Cannabis", "percentage": 10}]'::jsonb
)
ON CONFLICT (user_id) DO UPDATE SET
    current_value = EXCLUDED.current_value,
    daily_roi = EXCLUDED.daily_roi,
    total_profit_loss = EXCLUDED.total_profit_loss,
    asset_allocation = EXCLUDED.asset_allocation;

-- Reset all values to zero for clean start
UPDATE portfolios SET 
    current_value = 0.00,
    daily_roi = 0.0000,
    total_profit_loss = 0.00,
    asset_allocation = '[]'::jsonb
WHERE user_id = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';

INSERT INTO transactions (user_id, type, amount, transaction_date, status)
VALUES
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Deposit', 1000.00, '2024-07-10 10:00:00+00', 'Completed'),
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Investment', 500.00, '2024-07-09 14:30:00+00', 'Completed'),
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Withdrawal', 200.00, '2024-07-08 09:15:00+00', 'Pending'),
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Investment', 750.00, '2024-07-07 11:00:00+00', 'Completed')
ON CONFLICT (id) DO NOTHING; -- Assuming 'id' is unique for transactions

-- Clear all transactions for clean start
DELETE FROM transactions WHERE user_id = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
