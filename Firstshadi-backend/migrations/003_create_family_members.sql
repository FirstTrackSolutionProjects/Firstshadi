CREATE TABLE IF NOT EXISTS family_members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  profile_id INT NOT NULL,
  relation ENUM('Father', 'Mother', 'Brother', 'Sister') NOT NULL,
  name VARCHAR(100) NOT NULL,
  job VARCHAR(50),
  occupation VARCHAR(100),
  qualification VARCHAR(100),
  is_married BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  INDEX idx_profile_id (profile_id)
);
