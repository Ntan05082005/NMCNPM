-- Add OAuth2 fields for social login
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(20) DEFAULT 'LOCAL';
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255);

-- Make password nullable for OAuth users (they won't have a password)
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- Create index for faster OAuth lookups
CREATE INDEX IF NOT EXISTS idx_users_provider_id ON users(provider, provider_id);
