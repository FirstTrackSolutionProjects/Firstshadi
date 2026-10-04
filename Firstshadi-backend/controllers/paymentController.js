import Payment from '../models/Payment.js';
import User from '../models/User.js';

// Get payment plans
export const getPlans = async (req, res) => {
  try {
    const plans = await Payment.getPlans();

    return res.status(200).json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Get plans error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get payment plans'
    });
  }
};

// Create payment
export const createPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plan, paymentMethod, upiId, cardLastFour } = req.body;

    if (!plan || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Plan and payment method are required'
      });
    }

    const payment = await Payment.create(
      userId,
      plan,
      paymentMethod,
      upiId,
      cardLastFour
    );

    return res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: payment
    });
  } catch (error) {
    console.error('Create payment error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment'
    });
  }
};

// Complete payment (simulate payment completion)
export const completePayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId, paymentId, transactionId } = req.body;

    const payment = await Payment.findByOrderId(orderId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to complete this payment'
      });
    }

    if (payment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment is already completed'
      });
    }

    const updated = await Payment.updateStatus(
      payment.id,
      'completed',
      paymentId || `PAY${Date.now().toString().slice(-8)}`,
      transactionId || `TXN${Date.now().toString().slice(-6)}`
    );

    return res.status(200).json({
      success: true,
      message: 'Payment completed successfully',
      data: updated
    });
  } catch (error) {
    console.error('Complete payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete payment'
    });
  }
};

// Get payment history
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const payments = await Payment.getForUser(userId);

    return res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get payment history'
    });
  }
};

// Get payment by order ID
export const getPaymentByOrderId = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const payment = await Payment.findByOrderId(orderId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this payment'
      });
    }

    return res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Get payment by order ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get payment'
    });
  }
};