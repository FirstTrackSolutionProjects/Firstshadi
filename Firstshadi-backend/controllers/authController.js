// import { pool } from '../config/database.js';
// import User from '../models/User.js';
// import Profile from '../models/Profile.js';
// import { generateToken, verifyToken } from '../config/auth.js';
// import { sendEmailOTP, sendPhoneOTP, verifyOTP as verifyOTPHelper } from '../utils/helpers.js';

// const generateOTP = () => {
//   return String(Math.floor(100000 + Math.random() * 900000));
// };

// // Register
// export const register = async (req, res) => {
//   try {
//     const { email, phone, password, name, profile_for, gender } = req.body;

//     if (!email || !phone || !password || !name || !gender) {
//       return res.status(400).json({
//         success: false,
//         message: 'All required fields must be provided'
//       });
//     }

//     const existingEmail = await User.findByEmail(email);
//     if (existingEmail) {
//       return res.status(409).json({
//         success: false,
//         message: 'Email already registered'
//       });
//     }

//     const existingPhone = await User.findByPhone(phone);
//     if (existingPhone) {
//       return res.status(409).json({
//         success: false,
//         message: 'Phone number already registered'
//       });
//     }

//     const user = await User.create({
//       email,
//       password,
//       name,
//       phone,
//       profile_for: profile_for || 'Myself',
//       gender
//     });

//     const token = generateToken(user.id, user.email);

//     return res.status(201).json({
//       success: true,
//       message: 'User registered successfully',
//       data: {
//         user: {
//           id: user.uuid,
//           name: user.name,
//           email: user.email,
//           phone: user.phone,
//           is_verified: user.is_verified,
//           is_premium: user.is_premium
//         },
//         token
//       }
//     });
//   } catch (error) {
//     console.error('Registration error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Registration failed. Please try again.'
//     });
//   }
// };

// // Login
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email and password are required'
//       });
//     }

//     const user = await User.findByEmail(email);
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     const isValidPassword = await User.verifyPassword(user, password);
//     if (!isValidPassword) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     const token = generateToken(user.id, user.email);
//     const profile = await Profile.findByUserId(user.id);

//     return res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       data: {
//         user: {
//           id: user.uuid,
//           name: user.name,
//           email: user.email,
//           phone: user.phone,
//           is_verified: user.is_verified,
//           is_premium: user.is_premium,
//           premium_expiry: user.premium_expiry,
//           has_profile: !!profile
//         },
//         token
//       }
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Login failed. Please try again.'
//     });
//   }
// };

// // Send OTP
// export const sendOTP = async (req, res) => {
//   try {
//     const { email, phone, type } = req.body;

//     if (!type || (!email && !phone)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email or phone is required'
//       });
//     }

//     // Check if user exists for email verification
//     if (type === 'email_verification' && email) {
//       const user = await User.findByEmail(email);
//       if (user) {
//         return res.status(409).json({
//           success: false,
//           message: 'Email already registered'
//         });
//       }
//     }

//     const otp = generateOTP();
//     const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//     // Store OTP in database
//     await pool.query(
//       `INSERT INTO otps (email, phone, otp, type, expires_at)
//        VALUES (?, ?, ?, ?, ?)`,
//       [email || null, phone || null, otp, type, expiresAt]
//     );

//     // Send OTP
//     let otpSent = false;
//     if (email) {
//       await sendEmailOTP(email, otp);
//       otpSent = true;
//     }
//     if (phone) {
//       await sendPhoneOTP(phone, otp);
//       otpSent = true;
//     }

//     if (!otpSent) {
//       return res.status(400).json({
//         success: false,
//         message: 'No valid contact method provided'
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: 'OTP sent successfully',
//       data: {
//         otp: process.env.NODE_ENV === 'development' ? otp : undefined // Only show in development
//       }
//     });
//   } catch (error) {
//     console.error('Send OTP error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to send OTP. Please try again.'
//     });
//   }
// };

// // Verify OTP
// export const verifyOTP = async (req, res) => {
//   try {
//     const { email, phone, otp, type } = req.body;

//     if (!otp || !type || (!email && !phone)) {
//       return res.status(400).json({
//         success: false,
//         message: 'OTP and type are required'
//       });
//     }

//     const isValid = await verifyOTPHelper(email, phone, otp, type);

//     if (!isValid) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid or expired OTP'
//       });
//     }

//     // Mark OTP as used
//     await pool.query(
//       'UPDATE otps SET is_used = TRUE WHERE otp = ? AND is_used = FALSE',
//       [otp]
//     );

//     // If email verification, update user
//     if (type === 'email_verification' && email) {
//       await pool.query(
//         'UPDATE users SET is_verified = TRUE WHERE email = ?',
//         [email]
//       );
//     }

//     return res.status(200).json({
//       success: true,
//       message: 'OTP verified successfully'
//     });
//   } catch (error) {
//     console.error('Verify OTP error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'OTP verification failed. Please try again.'
//     });
//   }
// };

// // Get current user
// export const getCurrentUser = async (req, res) => {
//   try {
//     const user = req.user;
//     const profile = await Profile.findByUserId(user.id);

//     return res.status(200).json({
//       success: true,
//       data: {
//         user: {
//           id: user.uuid,
//           name: user.name,
//           email: user.email,
//           phone: user.phone,
//           is_verified: user.is_verified,
//           is_premium: user.is_premium,
//           premium_expiry: user.premium_expiry,
//           profile_for: user.profile_for,
//           gender: user.gender,
//           has_profile: !!profile
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Get current user error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to get user data'
//     });
//   }
// };

// // Forgot Password
// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email is required'
//       });
//     }

//     const user = await User.findByEmail(email);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found with this email'
//       });
//     }

//     const otp = generateOTP();
//     const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//     await pool.query(
//       `INSERT INTO otps (email, otp, type, expires_at)
//        VALUES (?, ?, 'reset_password', ?)`,
//       [email, otp, expiresAt]
//     );

//     await sendEmailOTP(email, otp);

//     return res.status(200).json({
//       success: true,
//       message: 'Password reset OTP sent successfully'
//     });
//   } catch (error) {
//     console.error('Forgot password error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to send password reset OTP'
//     });
//   }
// };

// // Reset Password
// export const resetPassword = async (req, res) => {
//   try {
//     const { email, otp, newPassword } = req.body;

//     if (!email || !otp || !newPassword) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email, OTP, and new password are required'
//       });
//     }

//     const isValid = await verifyOTPHelper(email, null, otp, 'reset_password');
//     if (!isValid) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid or expired OTP'
//       });
//     }

//     await pool.query(
//       'UPDATE otps SET is_used = TRUE WHERE otp = ? AND is_used = FALSE',
//       [otp]
//     );

//     const user = await User.findByEmail(email);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     await User.updatePassword(user.id, newPassword);

//     return res.status(200).json({
//       success: true,
//       message: 'Password reset successfully'
//     });
//   } catch (error) {
//     console.error('Reset password error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to reset password'
//     });
//   }
// };

// // Logout
// export const logout = async (req, res) => {
//   try {
//     return res.status(200).json({
//       success: true,
//       message: 'Logged out successfully'
//     });
//   } catch (error) {
//     console.error('Logout error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to logout'
//     });
//   }
// };

// // Refresh Token
// export const refreshToken = async (req, res) => {
//   try {
//     const { refreshToken } = req.body;

//     if (!refreshToken) {
//       return res.status(400).json({
//         success: false,
//         message: 'Refresh token is required'
//       });
//     }

//     const decoded = verifyToken(refreshToken);
    
//     if (!decoded || decoded.expired || decoded.invalid) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid or expired refresh token'
//       });
//     }

//     const newToken = generateToken(decoded.userId, decoded.email);

//     return res.status(200).json({
//       success: true,
//       message: 'Token refreshed successfully',
//       data: {
//         token: newToken
//       }
//     });
//   } catch (error) {
//     console.error('Refresh token error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to refresh token'
//     });
//   }
// };




import { pool } from '../config/database.js';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import { generateToken, verifyToken } from '../config/auth.js';
import { sendEmailOTP, sendPhoneOTP, verifyOTP as verifyOTPHelper } from '../utils/helpers.js';

const generateOTP = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

// Register
export const register = async (req, res) => {
  try {
    const { email, phone, password, name, profile_for, gender } = req.body;

    if (!email || !phone || !password || !name || !gender) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const existingPhone = await User.findByPhone(phone);
    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: 'Phone number already registered'
      });
    }

    const user = await User.create({
      email,
      password,
      name,
      phone,
      profile_for: profile_for || 'Myself',
      gender
    });

    // Mark user as verified because they verified OTPs during registration
    await User.update(user.id, { is_verified: true });

    const token = generateToken(user.id, user.email);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.uuid,
          name: user.name,
          email: user.email,
          phone: user.phone,
          is_verified: true,
          is_premium: user.is_premium,
          is_admin: !!user.is_admin,
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isValidPassword = await User.verifyPassword(user, password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user.id, user.email);
    const profile = await Profile.findByUserId(user.id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.uuid,
          name: user.name,
          email: user.email,
          phone: user.phone,
          is_verified: user.is_verified,
          is_premium: user.is_premium,
          premium_expiry: user.premium_expiry,
          is_admin: !!user.is_admin,
          has_profile: !!profile
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

// Send OTP
export const sendOTP = async (req, res) => {
  try {
    const { email, phone, type } = req.body;

    if (!type || (!email && !phone)) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone is required along with type'
      });
    }

    // For registration email verification, prevent duplicates
    if ((type === 'email_verification' || type === 'email') && email) {
      const user = await User.findByEmail(email);
      if (user) {
        return res.status(409).json({
          success: false,
          message: 'Email already registered'
        });
      }
    }
    if ((type === 'phone_verification' || type === 'phone') && phone) {
      const user = await User.findByPhone(phone);
      if (user) {
        return res.status(409).json({
          success: false,
          message: 'Phone number already registered'
        });
      }
    }

    // Normalize type
    const normalizedType =
      type === 'email' ? 'email_verification' :
      type === 'phone' ? 'phone_verification' :
      type;

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await pool.query(
      `INSERT INTO otps (email, phone, otp, type, expires_at)
       VALUES (?, ?, ?, ?, ?)`,
      [email || null, phone || null, otp, normalizedType, expiresAt]
    );

    let otpSent = false;
    if (email) {
      await sendEmailOTP(email, otp);
      otpSent = true;
    }
    if (phone) {
      await sendPhoneOTP(phone, otp);
      otpSent = true;
    }

    if (!otpSent) {
      return res.status(400).json({
        success: false,
        message: 'No valid contact method provided'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      }
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.'
    });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, phone, otp, type } = req.body;

    if (!otp || !type || (!email && !phone)) {
      return res.status(400).json({
        success: false,
        message: 'OTP and type are required'
      });
    }

    const normalizedType =
      type === 'email' ? 'email_verification' :
      type === 'phone' ? 'phone_verification' :
      type;

    const isValid = await verifyOTPHelper(email, phone, otp, normalizedType);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    await pool.query(
      'UPDATE otps SET is_used = TRUE WHERE otp = ? AND is_used = FALSE',
      [otp]
    );

    if (normalizedType === 'email_verification' && email) {
      await pool.query(
        'UPDATE users SET is_verified = TRUE WHERE email = ?',
        [email]
      );
    }

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'OTP verification failed. Please try again.'
    });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    const profile = await Profile.findByUserId(user.id);

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.uuid,
          name: user.name,
          email: user.email,
          phone: user.phone,
          is_verified: user.is_verified,
          is_premium: user.is_premium,
          premium_expiry: user.premium_expiry,
          profile_for: user.profile_for,
          gender: user.gender,
          is_admin: !!user.is_admin,
          has_profile: !!profile
        }
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get user data'
    });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `INSERT INTO otps (email, otp, type, expires_at)
       VALUES (?, ?, 'reset_password', ?)`,
      [email, otp, expiresAt]
    );

    await sendEmailOTP(email, otp);

    return res.status(200).json({
      success: true,
      message: 'Password reset OTP sent successfully',
      data: { otp: process.env.NODE_ENV === 'development' ? otp : undefined }
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send password reset OTP'
    });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, and new password are required'
      });
    }

    const isValid = await verifyOTPHelper(email, null, otp, 'reset_password');
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    await pool.query(
      'UPDATE otps SET is_used = TRUE WHERE otp = ? AND is_used = FALSE',
      [otp]
    );

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await User.updatePassword(user.id, newPassword);

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to logout'
    });
  }
};

// Refresh Token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    const decoded = verifyToken(refreshToken);

    if (!decoded || decoded.expired || decoded.invalid) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    const newToken = generateToken(decoded.userId, decoded.email);

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: { token: newToken }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to refresh token'
    });
  }
};