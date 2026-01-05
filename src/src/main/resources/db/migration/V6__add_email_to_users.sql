-- Add email column to users table
ALTER TABLE users ADD COLUMN email VARCHAR(255);

-- Update existing users with default email based on username
UPDATE users SET email = username || '@example.com' WHERE email IS NULL;

-- Make email NOT NULL and UNIQUE after setting default values
ALTER TABLE users ALTER COLUMN email SET NOT NULL;
ALTER TABLE users ADD CONSTRAINT uk_users_email UNIQUE (email);
