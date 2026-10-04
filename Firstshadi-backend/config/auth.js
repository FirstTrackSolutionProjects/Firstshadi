import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '30d';

/**
 * Generate JWT access token
 * @param {number} userId - User ID from database
 * @param {string} email - User email
 * @param {object} additionalData - Additional data to include in token (optional)
 * @returns {string} JWT token
 */
export const generateToken = (userId, email, additionalData = {}) => {
  return jwt.sign(
    { 
      userId, 
      email,
      ...additionalData 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

/**
 * Generate refresh token (longer expiry)
 * @param {number} userId - User ID from database
 * @param {string} email - User email
 * @returns {string} Refresh token
 */
export const generateRefreshToken = (userId, email) => {
  return jwt.sign(
    { userId, email, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRE }
  );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object|null} Decoded token data or null if invalid
 */
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { expired: true, error: 'Token has expired' };
    }
    if (error.name === 'JsonWebTokenError') {
      return { invalid: true, error: 'Invalid token' };
    }
    return null;
  }
};

/**
 * Decode token without verification (useful for checking expiry)
 * @param {string} token - JWT token
 * @returns {object|null} Decoded token data
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return false;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return true;
    }
    return true;
  }
};

/**
 * Get token expiry time in milliseconds
 * @param {string} token - JWT token
 * @returns {number|null} Expiry time in milliseconds or null
 */
export const getTokenExpiry = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (decoded && decoded.exp) {
      return decoded.exp * 1000; // Convert to milliseconds
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Get remaining time for token in milliseconds
 * @param {string} token - JWT token
 * @returns {number|null} Remaining time in milliseconds
 */
export const getTokenRemainingTime = (token) => {
  const expiry = getTokenExpiry(token);
  if (!expiry) return null;
  
  const now = Date.now();
  const remaining = expiry - now;
  return remaining > 0 ? remaining : 0;
};

/**
 * Generate both access and refresh tokens
 * @param {number} userId - User ID
 * @param {string} email - User email
 * @param {object} additionalData - Additional data for access token
 * @returns {object} { accessToken, refreshToken }
 */
export const generateTokenPair = (userId, email, additionalData = {}) => {
  return {
    accessToken: generateToken(userId, email, additionalData),
    refreshToken: generateRefreshToken(userId, email)
  };
};

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {object|null} { accessToken, user } or null if invalid
 */
export const refreshAccessToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    
    // Ensure it's a refresh token
    if (decoded.type !== 'refresh') {
      return null;
    }

    // Generate new access token
    const newAccessToken = generateToken(decoded.userId, decoded.email);
    
    return {
      accessToken: newAccessToken,
      user: {
        id: decoded.userId,
        email: decoded.email
      }
    };
  } catch (error) {
    return null;
  }
};

/**
 * Get JWT configuration
 * @returns {object} JWT configuration
 */
export const getJWTConfig = () => {
  return {
    secret: JWT_SECRET,
    expiresIn: JWT_EXPIRE,
    refreshExpiresIn: JWT_REFRESH_EXPIRE,
    algorithms: ['HS256']
  };
};

/**
 * Extract token from authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null
 */
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  
  // Check if it's a Bearer token
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // If it's just the token without Bearer prefix
  return authHeader;
};

/**
 * Create a secure token with additional claims
 * @param {number} userId - User ID
 * @param {string} email - User email
 * @param {object} claims - Additional claims
 * @param {string} expiresIn - Expiry time
 * @returns {string} JWT token
 */
export const createSecureToken = (userId, email, claims = {}, expiresIn = JWT_EXPIRE) => {
  const payload = {
    userId,
    email,
    iat: Math.floor(Date.now() / 1000),
    ...claims
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export default {
  generateToken,
  generateRefreshToken,
  generateTokenPair,
  verifyToken,
  decodeToken,
  isTokenExpired,
  getTokenExpiry,
  getTokenRemainingTime,
  refreshAccessToken,
  getJWTConfig,
  extractTokenFromHeader,
  createSecureToken,
  JWT_SECRET,
  JWT_EXPIRE,
  JWT_REFRESH_EXPIRE
};