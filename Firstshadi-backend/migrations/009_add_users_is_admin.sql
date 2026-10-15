ALTER TABLE users
  ADD COLUMN is_admin BOOLEAN DEFAULT FALSE AFTER is_premium,
  ADD INDEX idx_is_admin (is_admin);
