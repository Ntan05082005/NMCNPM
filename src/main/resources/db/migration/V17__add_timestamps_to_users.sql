-- Add timestamp columns to users table (IF NOT EXISTS for safety)
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Update existing records to have timestamps
UPDATE users SET created_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE created_at IS NULL;

-- Make columns NOT NULL after setting default values
ALTER TABLE users ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE users ALTER COLUMN updated_at SET NOT NULL;
