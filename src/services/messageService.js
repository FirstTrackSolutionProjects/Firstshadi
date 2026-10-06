// src/services/messageService.js
import { api } from './api';

export const messageService = {
  // Send a message inside an accepted connection
  async sendMessage(connectionId, message) {
    return await api.post('/messages', { connectionId, message });
  },

  // Get messages for a connection
  async getMessages(connectionId, limit = 50, offset = 0) {
    return await api.get(`/messages/${connectionId}?limit=${limit}&offset=${offset}`);
  },

  // Get all conversations for the current user
  async getConversations() {
    return await api.get('/messages/conversations');
  },

  // Get unread count across all conversations
  async getUnreadCount() {
    return await api.get('/messages/unread-count');
  },

  // Mark a single message as read
  async markAsRead(messageId) {
    return await api.put(`/messages/${messageId}/read`);
  }
};