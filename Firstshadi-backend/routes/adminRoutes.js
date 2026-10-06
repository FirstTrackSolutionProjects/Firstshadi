// import express from 'express';
// import { authenticate, requirePremium } from '../middleware/auth.js';

// const router = express.Router();

// // All admin routes require authentication and premium
// router.use(authenticate);
// router.use(requirePremium);

// // Admin Dashboard
// router.get('/dashboard', async (req, res) => {
//   try {
//     // Get some stats
//     const { pool } = await import('../config/database.js');
    
//     const [userCount] = await pool.query('SELECT COUNT(*) as total FROM users');
//     const [profileCount] = await pool.query('SELECT COUNT(*) as total FROM profiles');
//     const [connectionCount] = await pool.query('SELECT COUNT(*) as total FROM connections WHERE status = "accepted"');
//     const [paymentCount] = await pool.query('SELECT COUNT(*) as total FROM payments WHERE status = "completed"');
    
//     res.json({
//       success: true,
//       data: {
//         totalUsers: userCount[0].total,
//         totalProfiles: profileCount[0].total,
//         totalConnections: connectionCount[0].total,
//         totalPayments: paymentCount[0].total
//       }
//     });
//   } catch (error) {
//     console.error('Dashboard error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to load dashboard'
//     });
//   }
// });

// // Get all users
// router.get('/users', async (req, res) => {
//   try {
//     const { pool } = await import('../config/database.js');
//     const { limit = 50, offset = 0 } = req.query;
    
//     const [users] = await pool.query(
//       'SELECT id, uuid, name, email, phone, gender, is_verified, is_premium, premium_expiry, created_at FROM users LIMIT ? OFFSET ?',
//       [parseInt(limit), parseInt(offset)]
//     );
    
//     const [total] = await pool.query('SELECT COUNT(*) as total FROM users');
    
//     res.json({
//       success: true,
//       data: users,
//       pagination: {
//         total: total[0].total,
//         limit: parseInt(limit),
//         offset: parseInt(offset)
//       }
//     });
//   } catch (error) {
//     console.error('Get users error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get users'
//     });
//   }
// });

// // Get user by ID
// router.get('/users/:uuid', async (req, res) => {
//   try {
//     const { pool } = await import('../config/database.js');
//     const { uuid } = req.params;
    
//     const [users] = await pool.query(
//       `SELECT u.*, p.* 
//        FROM users u 
//        LEFT JOIN profiles p ON u.id = p.user_id 
//        WHERE u.uuid = ?`,
//       [uuid]
//     );
    
//     if (users.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       data: users[0]
//     });
//   } catch (error) {
//     console.error('Get user error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get user'
//     });
//   }
// });

// // Get all payments
// router.get('/payments', async (req, res) => {
//   try {
//     const { pool } = await import('../config/database.js');
//     const { limit = 50, offset = 0 } = req.query;
    
//     const [payments] = await pool.query(
//       `SELECT p.*, u.name as user_name, u.email as user_email 
//        FROM payments p 
//        LEFT JOIN users u ON p.user_id = u.id 
//        ORDER BY p.created_at DESC 
//        LIMIT ? OFFSET ?`,
//       [parseInt(limit), parseInt(offset)]
//     );
    
//     const [total] = await pool.query('SELECT COUNT(*) as total FROM payments');
    
//     res.json({
//       success: true,
//       data: payments,
//       pagination: {
//         total: total[0].total,
//         limit: parseInt(limit),
//         offset: parseInt(offset)
//       }
//     });
//   } catch (error) {
//     console.error('Get payments error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get payments'
//     });
//   }
// });

// // Toggle user premium status
// router.put('/users/:uuid/premium', async (req, res) => {
//   try {
//     const { pool } = await import('../config/database.js');
//     const { uuid } = req.params;
//     const { is_premium, days = 30 } = req.body;
    
//     // Get user
//     const [users] = await pool.query('SELECT id FROM users WHERE uuid = ?', [uuid]);
//     if (users.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }
    
//     let premium_expiry = null;
//     if (is_premium) {
//       const expiryDate = new Date();
//       expiryDate.setDate(expiryDate.getDate() + days);
//       premium_expiry = expiryDate.toISOString().split('T')[0];
//     }
    
//     await pool.query(
//       'UPDATE users SET is_premium = ?, premium_expiry = ? WHERE id = ?',
//       [is_premium, premium_expiry, users[0].id]
//     );
    
//     res.json({
//       success: true,
//       message: `User premium status updated to ${is_premium ? 'active' : 'inactive'}`
//     });
//   } catch (error) {
//     console.error('Update premium error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update premium status'
//     });
//   }
// });

// // Get admin stats
// router.get('/stats', async (req, res) => {
//   try {
//     const { pool } = await import('../config/database.js');
    
//     // Get various stats
//     const [userStats] = await pool.query(`
//       SELECT 
//         COUNT(*) as total_users,
//         SUM(CASE WHEN is_verified = TRUE THEN 1 ELSE 0 END) as verified_users,
//         SUM(CASE WHEN is_premium = TRUE THEN 1 ELSE 0 END) as premium_users,
//         SUM(CASE WHEN is_premium = FALSE THEN 1 ELSE 0 END) as free_users
//       FROM users
//     `);
    
//     const [profileStats] = await pool.query(`
//       SELECT 
//         COUNT(*) as total_profiles,
//         SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active_profiles
//       FROM profiles
//     `);
    
//     const [connectionStats] = await pool.query(`
//       SELECT 
//         COUNT(*) as total_connections,
//         SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_requests,
//         SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted_connections,
//         SUM(CASE WHEN status = 'declined' THEN 1 ELSE 0 END) as declined_requests
//       FROM connections
//     `);
    
//     const [paymentStats] = await pool.query(`
//       SELECT 
//         COUNT(*) as total_payments,
//         SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_payments,
//         SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_payments,
//         SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_payments,
//         SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) as total_revenue
//       FROM payments
//     `);
    
//     // Get daily registrations (last 7 days)
//     const [dailyRegistrations] = await pool.query(`
//       SELECT DATE(created_at) as date, COUNT(*) as count 
//       FROM users 
//       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
//       GROUP BY DATE(created_at)
//       ORDER BY date ASC
//     `);
    
//     res.json({
//       success: true,
//       data: {
//         users: userStats[0],
//         profiles: profileStats[0],
//         connections: connectionStats[0],
//         payments: paymentStats[0],
//         dailyRegistrations
//       }
//     });
//   } catch (error) {
//     console.error('Get stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get stats'
//     });
//   }
// });

// export default router;


import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { pool } from '../config/database.js';
import { listReports, resolveReport } from '../controllers/reportController.js';

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', async (req, res) => {
  try {
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
    res.status(500).json({ success: false, message: 'Failed to load dashboard' });
  }
});

// Users list (with search + verified/premium filter)
router.get('/users', async (req, res) => {
  try {
    const { limit = 50, offset = 0, search = '', is_premium, is_verified, is_active } = req.query;
    let query = 'SELECT id, uuid, name, email, phone, gender, is_verified, is_premium, is_admin, is_active, premium_expiry, created_at FROM users WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }
    if (is_premium !== undefined && is_premium !== '') { query += ' AND is_premium = ?'; params.push(is_premium === 'true'); }
    if (is_verified !== undefined && is_verified !== '') { query += ' AND is_verified = ?'; params.push(is_verified === 'true'); }
    if (is_active !== undefined && is_active !== '') { query += ' AND is_active = ?'; params.push(is_active === 'true'); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [users] = await pool.query(query, params);
    const [total] = await pool.query('SELECT COUNT(*) as total FROM users');
    res.json({ success: true, data: users, pagination: { total: total[0].total, limit: parseInt(limit), offset: parseInt(offset) } });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Failed to get users' });
  }
});

// Get one user
router.get('/users/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    const [users] = await pool.query(
      `SELECT u.*, p.* FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.uuid = ?`,
      [uuid]
    );
    if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: users[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Failed to get user' });
  }
});

// Payments list
router.get('/payments', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const [payments] = await pool.query(
      `SELECT p.*, u.name as user_name, u.email as user_email
       FROM payments p LEFT JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
      [parseInt(limit), parseInt(offset)]
    );
    const [total] = await pool.query('SELECT COUNT(*) as total FROM payments');
    res.json({ success: true, data: payments, pagination: { total: total[0].total, limit: parseInt(limit), offset: parseInt(offset) } });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ success: false, message: 'Failed to get payments' });
  }
});

// Toggle premium
router.put('/users/:uuid/premium', async (req, res) => {
  try {
    const { uuid } = req.params;
    const { is_premium, days = 30 } = req.body;
    const [users] = await pool.query('SELECT id FROM users WHERE uuid = ?', [uuid]);
    if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

    let premium_expiry = null;
    if (is_premium) {
      const d = new Date();
      d.setDate(d.getDate() + days);
      premium_expiry = d.toISOString().split('T')[0];
    }
    await pool.query('UPDATE users SET is_premium = ?, premium_expiry = ? WHERE id = ?', [is_premium, premium_expiry, users[0].id]);
    res.json({ success: true, message: `Premium ${is_premium ? 'activated' : 'deactivated'}` });
  } catch (error) {
    console.error('Update premium error:', error);
    res.status(500).json({ success: false, message: 'Failed to update premium status' });
  }
});

// Toggle admin
router.put('/users/:uuid/admin', async (req, res) => {
  try {
    const { uuid } = req.params;
    const { is_admin } = req.body;
    const [users] = await pool.query('SELECT id FROM users WHERE uuid = ?', [uuid]);
    if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    await pool.query('UPDATE users SET is_admin = ? WHERE id = ?', [!!is_admin, users[0].id]);
    res.json({ success: true, message: `Admin ${is_admin ? 'granted' : 'revoked'}` });
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({ success: false, message: 'Failed to update admin status' });
  }
});

// Toggle verified
router.put('/users/:uuid/verify', async (req, res) => {
  try {
    const { uuid } = req.params;
    const { is_verified } = req.body;
    const [users] = await pool.query('SELECT id FROM users WHERE uuid = ?', [uuid]);
    if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    await pool.query('UPDATE users SET is_verified = ? WHERE id = ?', [!!is_verified, users[0].id]);
    res.json({ success: true, message: `Verified ${is_verified ? 'on' : 'off'}` });
  } catch (error) {
    console.error('Update verify error:', error);
    res.status(500).json({ success: false, message: 'Failed to update verify status' });
  }
});

// Toggle active (suspend / restore)
router.put('/users/:uuid/active', async (req, res) => {
  try {
    const { uuid } = req.params;
    const { is_active } = req.body;
    const [users] = await pool.query('SELECT id FROM users WHERE uuid = ?', [uuid]);
    if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [!!is_active, users[0].id]);
    res.json({ success: true, message: `User ${is_active ? 'restored' : 'suspended'}` });
  } catch (error) {
    console.error('Update active error:', error);
    res.status(500).json({ success: false, message: 'Failed to update active status' });
  }
});

// Stats
router.get('/stats', async (req, res) => {
  try {
    const [userStats] = await pool.query(`
      SELECT
        COUNT(*) as total_users,
        SUM(CASE WHEN is_verified = TRUE THEN 1 ELSE 0 END) as verified_users,
        SUM(CASE WHEN is_premium = TRUE THEN 1 ELSE 0 END) as premium_users,
        SUM(CASE WHEN is_premium = FALSE THEN 1 ELSE 0 END) as free_users
      FROM users
    `);
    const [profileStats] = await pool.query(`
      SELECT COUNT(*) as total_profiles,
        SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active_profiles
      FROM profiles
    `);
    const [connectionStats] = await pool.query(`
      SELECT COUNT(*) as total_connections,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_requests,
        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted_connections,
        SUM(CASE WHEN status = 'declined' THEN 1 ELSE 0 END) as declined_requests
      FROM connections
    `);
    const [paymentStats] = await pool.query(`
      SELECT COUNT(*) as total_payments,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_payments,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_payments,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_payments,
        SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) as total_revenue
      FROM payments
    `);
    const [dailyRegistrations] = await pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM users WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at) ORDER BY date ASC
    `);
    const [reportStats] = await pool.query(`
      SELECT COUNT(*) as total_reports,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_reports
      FROM reports
    `);
    res.json({
      success: true,
      data: {
        users: userStats[0],
        profiles: profileStats[0],
        connections: connectionStats[0],
        payments: paymentStats[0],
        reports: reportStats[0],
        dailyRegistrations,
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to get stats' });
  }
});

// Reports (delegate)
router.get('/reports', listReports);
router.put('/reports/:reportId/resolve', resolveReport);

// Approve/reject profile (set is_active)
router.put('/profiles/:profileId/approve', async (req, res) => {
  try {
    const { profileId } = req.params;
    const { is_active } = req.body;
    await pool.query('UPDATE profiles SET is_active = ? WHERE id = ?', [!!is_active, profileId]);
    res.json({ success: true, message: `Profile ${is_active ? 'approved' : 'rejected'}` });
  } catch (error) {
    console.error('Approve profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

// Pending profiles for approval
router.get('/profiles/pending', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const [rows] = await pool.query(
      `SELECT p.*, u.name, u.email, u.phone, u.uuid as user_uuid
       FROM profiles p
       INNER JOIN users u ON p.user_id = u.id
       WHERE p.is_active = FALSE
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [parseInt(limit), parseInt(offset)]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Pending profiles error:', error);
    res.status(500).json({ success: false, message: 'Failed to load pending profiles' });
  }
});

export default router;