-- Drop foreign key constraint first
ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_role;

-- Drop the old role_id column
ALTER TABLE users DROP COLUMN IF EXISTS role_id;

-- Add new role column as VARCHAR (for enum)
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'USER' NOT NULL;

-- Update existing users to have USER role
UPDATE users SET role = 'USER' WHERE role IS NULL;
