// src/services/connectionService.js
import { api } from './api';

export const connectionService = {
  // Send connection request
  async sendRequest(toUserId, message) {
    return await api.post('/connections/request', { toUserId, message });
  },

  // Accept connection request
  async acceptRequest(connectionId) {
    return await api.put(`/connections/${connectionId}/accept`);
  },

  // Decline connection request
  async declineRequest(connectionId) {
    return await api.put(`/connections/${connectionId}/decline`);
  },

  // Get received requests
  async getReceivedRequests() {
    return await api.get('/connections/received');
  },

  // Get sent requests
  async getSentRequests() {
    return await api.get('/connections/sent');
  },

  // Get accepted connections
  async getAcceptedConnections() {
    return await api.get('/connections/accepted');
  },

  // Block user
  async blockUser(targetUserId) {
    return await api.put(`/connections/block/${targetUserId}`);
  }
};