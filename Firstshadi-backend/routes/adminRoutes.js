import express from 'express';
import { authenticate, requirePremium } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and premium
router.use(authenticate);
router.use(requirePremium);

// Admin Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    // Get some stats
    const { pool } = await import('../config/database.js');
    
    const [userCount] = await pool.query('SELECT COUNT(*) as total FROM users');
    const [profileCount] = await pool.query('SELECT COUNT(*) as total FROM profiles');
    const [connectionCount] = await pool.query('SELECT COUNT(*) as total FROM connections WHERE status = "accepted"');
    const [paymentCount] = await pool.query('SELECT COUNT(*) as total FROM payments WHERE status = "completed"');
    
    res.json({
      success: true,
      data: {
        totalUsers: userCount[0].total,
        totalProfiles: profileCount[0].total,
        totalConnections: connectionCount[0].total,
        totalPayments: paymentCount[0].total
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard'
    });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { pool } = await import('../config/database.js');
    const { limit = 50, offset = 0 } = req.query;
    
    const [users] = await pool.query(
      'SELECT id, uuid, name, email, phone, gender, is_verified, is_premium, premium_expiry, created_at FROM users LIMIT ? OFFSET ?',
      [parseInt(limit), parseInt(offset)]
    );
    
    const [total] = await pool.query('SELECT COUNT(*) as total FROM users');
    
    res.json({
      success: true,
      data: users,
      pagination: {
        total: total[0].total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
});

// Get user by ID
router.get('/users/:uuid', async (req, res) => {
  try {
    const { pool } = await import('../config/database.js');
    const { uuid } = req.params;
    
    const [users] = await pool.query(
      `SELECT u.*, p.* 
       FROM users u 
       LEFT JOIN profiles p ON u.id = p.user_id 
       WHERE u.uuid = ?`,
      [uuid]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user'
    });
  }
});

// Get all payments
router.get('/payments', async (req, res) => {
  try {
    const { pool } = await import('../config/database.js');
    const { limit = 50, offset = 0 } = req.query;
    
    const [payments] = await pool.query(
      `SELECT p.*, u.name as user_name, u.email as user_email 
       FROM payments p 
       LEFT JOIN users u ON p.user_id = u.id 
       ORDER BY p.created_at DESC 
       LIMIT ? OFFSET ?`,
      [parseInt(limit), parseInt(offset)]
    );
    
    const [total] = await pool.query('SELECT COUNT(*) as total FROM payments');
    
    res.json({
      success: true,
      data: payments,
      pagination: {
        total: total[0].total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payments'
    });
  }
});

// Toggle user premium status
router.put('/users/:uuid/premium', async (req, res) => {
  try {
    const { pool } = await import('../config/database.js');
    const { uuid } = req.params;
    const { is_premium, days = 30 } = req.body;
    
    // Get user
    const [users] = await pool.query('SELECT id FROM users WHERE uuid = ?', [uuid]);
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    let premium_expiry = null;
    if (is_premium) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + days);
      premium_expiry = expiryDate.toISOString().split('T')[0];
    }
    
    await pool.query(
      'UPDATE users SET is_premium = ?, premium_expiry = ? WHERE id = ?',
      [is_premium, premium_expiry, users[0].id]
    );
    
    res.json({
      success: true,
      message: `User premium status updated to ${is_premium ? 'active' : 'inactive'}`
    });
  } catch (error) {
    console.error('Update premium error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update premium status'
    });
  }
});

// Get admin stats
router.get('/stats', async (req, res) => {
  try {
    const { pool } = await import('../config/database.js');
    
    // Get various stats
    const [userStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN is_verified = TRUE THEN 1 ELSE 0 END) as verified_users,
        SUM(CASE WHEN is_premium = TRUE THEN 1 ELSE 0 END) as premium_users,
        SUM(CASE WHEN is_premium = FALSE THEN 1 ELSE 0 END) as free_users
      FROM users
    `);
    
    const [profileStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_profiles,
        SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active_profiles
      FROM profiles
    `);
    
    const [connectionStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_connections,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_requests,
        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted_connections,
        SUM(CASE WHEN status = 'declined' THEN 1 ELSE 0 END) as declined_requests
      FROM connections
    `);
    
    const [paymentStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_payments,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_payments,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_payments,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_payments,
        SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) as total_revenue
      FROM payments
    `);
    
    // Get daily registrations (last 7 days)
    const [dailyRegistrations] = await pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count 
      FROM users 
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
    
    res.json({
      success: true,
      data: {
        users: userStats[0],
        profiles: profileStats[0],
        connections: connectionStats[0],
        payments: paymentStats[0],
        dailyRegistrations
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get stats'
    });
  }
});

export default router;