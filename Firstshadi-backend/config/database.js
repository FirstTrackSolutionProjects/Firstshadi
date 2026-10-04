// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';

// dotenv.config();

// // Database connection pool
// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'firstmarriage',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   enableKeepAlive: true,
//   keepAliveInitialDelay: 0
// });

// // Connect and initialize database
// export const connectDB = async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log('✅ MySQL Database connected successfully');
//     connection.release();
    
//     await initializeDatabase();
//   } catch (error) {
//     console.error('❌ Database connection failed:', error.message);
//     process.exit(1);
//   }
// };

// // Initialize database tables
// const initializeDatabase = async () => {
//   const connection = await pool.getConnection();
//   try {
//     // Users table
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id INT PRIMARY KEY AUTO_INCREMENT,
//         uuid VARCHAR(36) UNIQUE NOT NULL,
//         email VARCHAR(255) UNIQUE NOT NULL,
//         password_hash VARCHAR(255) NOT NULL,
//         name VARCHAR(255) NOT NULL,
//         phone VARCHAR(20) UNIQUE,
//         profile_for ENUM('Myself', 'My Son', 'My Daughter', 'My Brother', 'My Sister', 'My Friend', 'My Relative') DEFAULT 'Myself',
//         gender ENUM('Male', 'Female') NOT NULL,
//         is_verified BOOLEAN DEFAULT FALSE,
//         is_premium BOOLEAN DEFAULT FALSE,
//         premium_expiry DATE,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         INDEX idx_email (email),
//         INDEX idx_phone (phone),
//         INDEX idx_gender (gender),
//         INDEX idx_is_premium (is_premium)
//       )
//     `);

//     // Profiles table
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS profiles (
//         id INT PRIMARY KEY AUTO_INCREMENT,
//         user_id INT NOT NULL,
//         first_name VARCHAR(100) NOT NULL,
//         last_name VARCHAR(100),
//         dob DATE NOT NULL,
//         age INT,
//         religion VARCHAR(50),
//         community VARCHAR(50),
//         caste VARCHAR(50),
//         mother_tongue VARCHAR(50),
//         marital_status ENUM('Never Married', 'Divorced', 'Widowed', 'Separated') DEFAULT 'Never Married',
//         height VARCHAR(20),
//         weight VARCHAR(20),
//         body_shape VARCHAR(50),
//         face_color VARCHAR(30),
//         blood_group VARCHAR(5),
//         zodiac VARCHAR(30),
//         manglik ENUM('Yes', 'No', "Don't Know") DEFAULT 'No',
//         country VARCHAR(50),
//         state VARCHAR(50),
//         city VARCHAR(50),
//         current_address TEXT,
//         permanent_address TEXT,
//         birth_place VARCHAR(100),
//         education VARCHAR(100),
//         employed_in VARCHAR(50),
//         occupation VARCHAR(100),
//         annual_income VARCHAR(50),
//         hobbies TEXT,
//         about_me TEXT,
//         favorite_color VARCHAR(30),
//         favorite_song VARCHAR(100),
//         favorite_movies TEXT,
//         profile_photos JSON,
//         looking_for ENUM('Man', 'Woman') DEFAULT 'Woman',
//         is_active BOOLEAN DEFAULT TRUE,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
//         INDEX idx_user_id (user_id),
//         INDEX idx_religion (religion),
//         INDEX idx_caste (caste),
//         INDEX idx_city (city),
//         INDEX idx_age (age),
//         INDEX idx_is_active (is_active)
//       )
//     `);

//     // Family members table
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS family_members (
//         id INT PRIMARY KEY AUTO_INCREMENT,
//         profile_id INT NOT NULL,
//         relation ENUM('Father', 'Mother', 'Brother', 'Sister') NOT NULL,
//         name VARCHAR(100) NOT NULL,
//         job VARCHAR(50),
//         occupation VARCHAR(100),
//         qualification VARCHAR(100),
//         is_married BOOLEAN DEFAULT FALSE,
//         FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
//         INDEX idx_profile_id (profile_id)
//       )
//     `);

//     // Connections table
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS connections (
//         id INT PRIMARY KEY AUTO_INCREMENT,
//         from_user_id INT NOT NULL,
//         to_user_id INT NOT NULL,
//         status ENUM('pending', 'accepted', 'declined', 'blocked') DEFAULT 'pending',
//         message TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
//         FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE,
//         UNIQUE KEY unique_connection (from_user_id, to_user_id),
//         INDEX idx_from_user (from_user_id),
//         INDEX idx_to_user (to_user_id),
//         INDEX idx_status (status)
//       )
//     `);

//     // Messages table
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS messages (
//         id INT PRIMARY KEY AUTO_INCREMENT,
//         connection_id INT NOT NULL,
//         sender_id INT NOT NULL,
//         receiver_id INT NOT NULL,
//         message TEXT NOT NULL,
//         is_read BOOLEAN DEFAULT FALSE,
//         read_at TIMESTAMP NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (connection_id) REFERENCES connections(id) ON DELETE CASCADE,
//         FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
//         FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
//         INDEX idx_connection_id (connection_id),
//         INDEX idx_sender_id (sender_id),
//         INDEX idx_receiver_id (receiver_id),
//         INDEX idx_is_read (is_read)
//       )
//     `);

//     // Notifications table
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS notifications (
//         id INT PRIMARY KEY AUTO_INCREMENT,
//         user_id INT NOT NULL,
//         type VARCHAR(50) NOT NULL,
//         title VARCHAR(255) NOT NULL,
//         message TEXT NOT NULL,
//         data JSON,
//         is_read BOOLEAN DEFAULT FALSE,
//         read_at TIMESTAMP NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
//         INDEX idx_user_id (user_id),
//         INDEX idx_is_read (is_read),
//         INDEX idx_created_at (created_at)
//       )
//     `);

//     // Payments table
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS payments (
//         id INT PRIMARY KEY AUTO_INCREMENT,
//         user_id INT NOT NULL,
//         order_id VARCHAR(50) UNIQUE NOT NULL,
//         payment_id VARCHAR(50),
//         plan ENUM('7days', '15days', '30days', '3months', '5months', '1year') NOT NULL,
//         amount DECIMAL(10, 2) NOT NULL,
//         gst DECIMAL(10, 2),
//         total_amount DECIMAL(10, 2) NOT NULL,
//         status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
//         payment_method VARCHAR(50),
//         upi_id VARCHAR(100),
//         card_last_four VARCHAR(4),
//         transaction_id VARCHAR(100),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         completed_at TIMESTAMP NULL,
//         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
//         INDEX idx_user_id (user_id),
//         INDEX idx_order_id (order_id),
//         INDEX idx_status (status)
//       )
//     `);

//     // OTP table
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS otps (
//         id INT PRIMARY KEY AUTO_INCREMENT,
//         email VARCHAR(255),
//         phone VARCHAR(20),
//         otp VARCHAR(6) NOT NULL,
//         type ENUM('email', 'phone', 'reset_password') NOT NULL,
//         is_used BOOLEAN DEFAULT FALSE,
//         expires_at TIMESTAMP NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         INDEX idx_email (email),
//         INDEX idx_phone (phone),
//         INDEX idx_otp (otp),
//         INDEX idx_expires_at (expires_at)
//       )
//     `);

//     console.log('✅ Database tables initialized successfully');
//   } catch (error) {
//     console.error('❌ Error initializing database:', error.message);
//     throw error;
//   } finally {
//     connection.release();
//   }
// };

// export { pool };




import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'n1a2y3a4k5@9090',
  database: process.env.DB_NAME || 'firstmarriage',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Connect and initialize database
export const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully');
    console.log(`📊 Database: ${process.env.DB_NAME || 'firstmarriage'}`);
    connection.release();
    
    // Check if tables exist (optional verification)
    await verifyTables();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// Verify tables exist (without creating them)
const verifyTables = async () => {
  const connection = await pool.getConnection();
  try {
    // Check if users table exists
    const [tables] = await connection.query(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'",
      [process.env.DB_NAME || 'firstmarriage']
    );

    if (tables.length === 0) {
      console.warn('⚠️  Tables not found! Please run the SQL script in MySQL Workbench first.');
      console.warn('📝 SQL file location: database.sql');
    } else {
      // Count tables
      const [countResult] = await connection.query(
        "SELECT COUNT(*) as total FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?",
        [process.env.DB_NAME || 'firstmarriage']
      );
      console.log(`✅ Found ${countResult[0].total} tables in database`);
    }
  } catch (error) {
    console.error('❌ Error verifying tables:', error.message);
  } finally {
    connection.release();
  }
};

export { pool };