// src/services/paymentService.js
import { api } from './api';

export const paymentService = {
  // Get all available plans
  async getPlans() {
    return await api.get('/payments/plans');
  },

  // Create a payment record
  async createPayment({ plan, paymentMethod, upiId, cardLastFour }) {
    return await api.post('/payments', {
      plan,
      paymentMethod,
      upiId,
      cardLastFour,
    });
  },

  // Complete a payment (simulated gateway callback)
  async completePayment({ orderId, paymentId, transactionId }) {
    return await api.post('/payments/complete', {
      orderId,
      paymentId,
      transactionId,
    });
  },

  // Get the current user's payment history
  async getHistory() {
    return await api.get('/payments/history');
  },

  // Get a single payment by order ID
  async getByOrderId(orderId) {
    return await api.get(`/payments/${orderId}`);
  },
};