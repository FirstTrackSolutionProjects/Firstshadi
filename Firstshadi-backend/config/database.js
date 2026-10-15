import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const requiredProductionSettings = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
if (process.env.NODE_ENV === 'production') {
  const missingSettings = requiredProductionSettings.filter((key) => !process.env[key]);
  if (missingSettings.length > 0) {
    throw new Error(`Missing required production database settings: ${missingSettings.join(', ')}`);
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'firstmarriage',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

export const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully');
    console.log(`📊 Database: ${process.env.DB_NAME || 'firstmarriage'}`);
    connection.release();
    await showAdminStatus();   // 🔥 NEW: dikhata hai kitne admins hain
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    if (process.env.NODE_ENV === 'production') process.exit(1);
  }
};

// 🔥 NEW: On startup, tells you how many admins exist + which emails
const showAdminStatus = async () => {
  try {
    const [admins] = await pool.query(
      "SELECT email, name FROM users WHERE is_admin = TRUE"
    );
    if (admins.length === 0) {
      console.log('');
      console.log('╔════════════════════════════════════════════════════════╗');
      console.log('║  ⚠️  NO ADMIN USERS FOUND                              ║');
      console.log('║                                                        ║');
      console.log('║  Run this in MySQL to make yourself admin:             ║');
      console.log("║  UPDATE users SET is_admin = TRUE                      ║");
      console.log("║    WHERE email = 'your-email@example.com';             ║");
      console.log('╚════════════════════════════════════════════════════════╝');
      console.log('');
    } else {
      console.log(`👑 ${admins.length} admin user(s):`);
      admins.forEach((a) => console.log(`   • ${a.email} (${a.name})`));
    }
  } catch (error) {
    console.error('⚠️  Could not check admin status:', error.message);
  }
};

export { pool };
