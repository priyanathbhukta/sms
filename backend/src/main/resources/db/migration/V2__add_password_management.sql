-- Migration script to add new columns for admin-controlled authentication
-- Run this against your PostgreSQL database: sms_db

-- Add must_change_password column (defaults to true for new users)
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT true;

-- Add personal_email column for sending credentials
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS personal_email VARCHAR(255);

-- Add password_changed_at column for tracking password lifecycle
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP;

-- Set existing admin users to not require password change
UPDATE app_users SET must_change_password = false WHERE role = 'ADMIN';

-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES app_users(id),
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for token lookup
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
