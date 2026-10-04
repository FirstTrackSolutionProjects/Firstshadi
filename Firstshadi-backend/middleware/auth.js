import { verifyToken } from '../config/auth.js';
import { pool } from '../config/database.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide a valid token.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please log in again.'
      });
    }

    // Get user from database
    const [users] = await pool.query(
      'SELECT id, uuid, email, name, phone, is_verified, is_premium, premium_expiry FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please log in again.'
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error. Please try again.'
    });
  }
};

export const requirePremium = (req, res, next) => {
  if (!req.user.is_premium) {
    return res.status(403).json({
      success: false,
      message: 'Premium membership required to access this feature.'
    });
  }
  
  // Check if premium has expired
  if (req.user.premium_expiry && new Date(req.user.premium_expiry) < new Date()) {
    return res.status(403).json({
      success: false,
      message: 'Your premium membership has expired. Please renew to access this feature.'
    });
  }
  
  next();
};