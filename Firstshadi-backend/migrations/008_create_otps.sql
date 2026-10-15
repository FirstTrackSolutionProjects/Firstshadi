CREATE TABLE IF NOT EXISTS otps (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255),
  phone VARCHAR(20),
  otp VARCHAR(6) NOT NULL,
  type ENUM('email', 'phone', 'reset_password') NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_phone (phone),
  INDEX idx_otp (otp),
  INDEX idx_expires_at (expires_at)
);
