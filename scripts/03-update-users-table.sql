-- Update users table to use simple PIN storage instead of pin_hash
ALTER TABLE users DROP COLUMN IF EXISTS pin_hash;
ALTER TABLE users ADD COLUMN IF NOT EXISTS pin VARCHAR(4);
