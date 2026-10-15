CREATE TABLE IF NOT EXISTS success_stories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  couple_names VARCHAR(255) NOT NULL,
  image_url VARCHAR(500),
  story TEXT NOT NULL,
  location VARCHAR(255),
  married_on DATE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_published (is_published)
);
