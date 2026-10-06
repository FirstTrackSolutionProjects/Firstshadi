import express from 'express';
import {
  register,
  login,
  sendOTP,
  verifyOTP,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  logout,
  refreshToken
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
// router.post('/send-otp', sendOTP);
// router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);
// Inside adminRoutes.js GET /users
router.get('/users', async (req, res) => {
  try {
    const { limit = 50, offset = 0, search = '' } = req.query;
    let query = 'SELECT id, uuid, name, email, phone, gender, is_verified, is_premium, is_admin, premium_expiry, created_at FROM users';
    const params = [];

    if (search) {
      query += ' WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?';
      const term = `%${search}%`;
      params.push(term, term, term);
    }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [users] = await pool.query(query, params);
    const [total] = await pool.query('SELECT COUNT(*) as total FROM users');

    res.json({
      success: true,
      data: users,
      pagination: { total: total[0].total, limit: parseInt(limit), offset: parseInt(offset) }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Failed to get users' });
  }
});

export default router;



