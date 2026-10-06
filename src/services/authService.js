// // src/services/authService.js
// import { api } from './api';

// export const authService = {
//   // Register user
//   async register(userData) {
//     const response = await api.post('/auth/register', userData);
//     if (response.success && response.data.token) {
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('user', JSON.stringify(response.data.user));
//     }
//     return response;
//   },

//   // Login user
//   async login(email, password) {
//     const response = await api.post('/auth/login', { email, password });
//     if (response.success && response.data.token) {
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('user', JSON.stringify(response.data.user));
//     }
//     return response;
//   },

//   // Send OTP
//   async sendOTP(email, phone, type) {
//     return await api.post('/auth/send-otp', { email, phone, type });
//   },

//   // Verify OTP
//   async verifyOTP(email, phone, otp, type) {
//     return await api.post('/auth/verify-otp', { email, phone, otp, type });
//   },

//   // Get current user
//   async getCurrentUser() {
//     return await api.get('/auth/me');
//   },

//   // Logout
//   logout() {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     // Navigate to login page
//     window.location.href = '/signin';
//   },

//   // Check if user is authenticated
//   isAuthenticated() {
//     return !!localStorage.getItem('token');
//   },

//   // Get user from localStorage
//   getUser() {
//     const user = localStorage.getItem('user');
//     return user ? JSON.parse(user) : null;
//   },

//   // Update stored user data
//   updateUser(userData) {
//     localStorage.setItem('user', JSON.stringify(userData));
//   }
// };


// src/services/authService.js
import { api } from './api';

export const authService = {
  // Register user
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  // Login user
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  // Send OTP — type is 'email_verification' | 'phone_verification' | 'reset_password'
  async sendOTP({ email, phone, type }) {
    return await api.post('/auth/send-otp', { email, phone, type });
  },

  // Verify OTP
  async verifyOTP({ email, phone, otp, type }) {
    return await api.post('/auth/verify-otp', { email, phone, otp, type });
  },

  // Get current user
  async getCurrentUser() {
    return await api.get('/auth/me');
  },

  // Forgot password
  async forgotPassword(email) {
    return await api.post('/auth/forgot-password', { email });
  },

  // Reset password
  async resetPassword(email, otp, newPassword) {
    return await api.post('/auth/reset-password', { email, otp, newPassword });
  },

  // Refresh access token
  async refreshToken(refreshToken) {
    return await api.post('/auth/refresh-token', { refreshToken });
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/signin';
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Get user from localStorage
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Update stored user data
  updateUser(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
  }
};