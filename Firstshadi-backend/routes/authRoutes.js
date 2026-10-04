// import express from 'express';
// import {
//   register,
//   login,
//   sendOTP,
//   verifyOTP,
//   getCurrentUser,
//   forgotPassword,
//   resetPassword,
//   logout,
//   refreshToken
// } from '../controllers/authController.js';
// import { authenticate } from '../middleware/auth.js';

// const router = express.Router();

// // Public routes
// router.post('/register', register);
// router.post('/login', login);
// router.post('/send-otp', sendOTP);
// router.post('/verify-otp', verifyOTP);
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password', resetPassword);
// router.post('/refresh-token', refreshToken);

// // Protected routes
// router.get('/me', authenticate, getCurrentUser);
// router.post('/logout', authenticate, logout);

// export default router;


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
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);

export default router;