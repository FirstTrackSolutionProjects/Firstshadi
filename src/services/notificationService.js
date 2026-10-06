// src/services/notificationService.js
import { api } from './api';

export const notificationService = {
  async getAll(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return await api.get(`/notifications${qs ? `?${qs}` : ''}`);
  },

  async markAsRead(id) {
    return await api.put(`/notifications/${id}/read`);
  },

  async markAllAsRead() {
    return await api.put('/notifications/read-all');
  },

  async delete(id) {
    return await api.delete(`/notifications/${id}`);
  },

  async deleteAll() {
    return await api.delete('/notifications');
  },
};
