// src/services/adminService.js
import { api } from './api';

export const adminService = {
  async getDashboard() {
    return await api.get('/admin/dashboard');
  },

  async getStats() {
    return await api.get('/admin/stats');
  },

  async getUsers({ limit = 50, offset = 0, search = '', is_premium, is_verified, is_active } = {}) {
    const params = new URLSearchParams({ limit, offset, search });
    if (is_premium !== undefined) params.set('is_premium', is_premium);
    if (is_verified !== undefined) params.set('is_verified', is_verified);
    if (is_active !== undefined) params.set('is_active', is_active);
    return await api.get(`/admin/users?${params.toString()}`);
  },

  async getUser(uuid) {
    return await api.get(`/admin/users/${uuid}`);
  },

  async setPremium(uuid, is_premium, days = 30) {
    return await api.put(`/admin/users/${uuid}/premium`, { is_premium, days });
  },

  async setAdmin(uuid, is_admin) {
    return await api.put(`/admin/users/${uuid}/admin`, { is_admin });
  },

  async getPayments({ limit = 50, offset = 0 } = {}) {
    const qs = new URLSearchParams({ limit, offset }).toString();
    return await api.get(`/admin/payments?${qs}`);
  },
};