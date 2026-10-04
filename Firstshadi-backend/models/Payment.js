import { pool } from '../config/database.js';

const PLANS = {
  '7days': { label: '7 Days', price: 199 },
  '15days': { label: '15 Days', price: 399 },
  '30days': { label: '30 Days', price: 599 },
  '3months': { label: '3 Months', price: 1499 },
  '5months': { label: '5 Months', price: 2499 },
  '1year': { label: '1 Year', price: 4499 }
};

export class Payment {
  static async create(userId, plan, paymentMethod, upiId = null, cardLastFour = null) {
    const planData = PLANS[plan];
    if (!planData) {
      throw new Error('Invalid plan selected');
    }

    const gst = planData.price * 0.18;
    const totalAmount = planData.price + gst;
    const orderId = 'ORD' + Date.now().toString().slice(-12) + Math.floor(1000 + Math.random() * 9000);

    const [result] = await pool.query(
      `INSERT INTO payments (
        user_id, order_id, plan, amount, gst, total_amount, payment_method, upi_id, card_last_four
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, orderId, plan, planData.price, gst, totalAmount,
        paymentMethod, upiId, cardLastFour
      ]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT p.*, u.name as user_name, u.email as user_email, u.phone as user_phone
       FROM payments p
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  static async findByOrderId(orderId) {
    const [rows] = await pool.query(
      `SELECT p.*, u.name as user_name, u.email as user_email, u.phone as user_phone
       FROM payments p
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.order_id = ?`,
      [orderId]
    );
    return rows[0] || null;
  }

  static async updateStatus(id, status, paymentId = null, transactionId = null) {
    const updates = ['status = ?'];
    const params = [status];

    if (paymentId) {
      updates.push('payment_id = ?');
      params.push(paymentId);
    }

    if (transactionId) {
      updates.push('transaction_id = ?');
      params.push(transactionId);
    }

    if (status === 'completed') {
      updates.push('completed_at = CURRENT_TIMESTAMP');
    }

    params.push(id);
    await pool.query(
      `UPDATE payments SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    // If payment is completed, update user premium status
    if (status === 'completed') {
      const payment = await this.findById(id);
      if (payment) {
        const plan = payment.plan;
        const daysMap = {
          '7days': 7,
          '15days': 15,
          '30days': 30,
          '3months': 90,
          '5months': 150,
          '1year': 365
        };
        const days = daysMap[plan] || 30;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + days);
        
        await pool.query(
          'UPDATE users SET is_premium = TRUE, premium_expiry = ? WHERE id = ?',
          [expiryDate.toISOString().split('T')[0], payment.user_id]
        );
      }
    }

    return this.findById(id);
  }

  static async getForUser(userId) {
    const [rows] = await pool.query(
      `SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async getPlans() {
    return Object.entries(PLANS).map(([key, value]) => ({
      id: key,
      ...value,
      gst: value.price * 0.18,
      total: value.price + (value.price * 0.18)
    }));
  }

  static async getRevenueSummary(startDate = null, endDate = null) {
    let query = 'SELECT * FROM payments WHERE status = "completed"';
    const params = [];

    if (startDate) {
      query += ' AND created_at >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND created_at <= ?';
      params.push(endDate);
    }

    const [rows] = await pool.query(query, params);

    const summary = {
      total_amount: 0,
      total_count: rows.length,
      by_plan: {},
      daily: {}
    };

    rows.forEach(row => {
      summary.total_amount += parseFloat(row.total_amount);

      if (!summary.by_plan[row.plan]) {
        summary.by_plan[row.plan] = { count: 0, amount: 0 };
      }
      summary.by_plan[row.plan].count++;
      summary.by_plan[row.plan].amount += parseFloat(row.total_amount);

      const date = row.created_at.toISOString().split('T')[0];
      if (!summary.daily[date]) {
        summary.daily[date] = { count: 0, amount: 0 };
      }
      summary.daily[date].count++;
      summary.daily[date].amount += parseFloat(row.total_amount);
    });

    return summary;
  }

  static async refundPayment(paymentId) {
    const payment = await this.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'completed') {
      throw new Error('Only completed payments can be refunded');
    }

    await pool.query(
      'UPDATE payments SET status = "refunded" WHERE id = ?',
      [paymentId]
    );

    // Remove premium status from user
    await pool.query(
      'UPDATE users SET is_premium = FALSE, premium_expiry = NULL WHERE id = ?',
      [payment.user_id]
    );

    return this.findById(paymentId);
  }

  static async getExpiringPremiums(daysBefore = 7) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysBefore);
    const expiryDateStr = expiryDate.toISOString().split('T')[0];

    const [rows] = await pool.query(
      `SELECT u.id, u.uuid, u.name, u.email, u.phone, u.premium_expiry, 
       p.id as payment_id, p.plan, p.total_amount
       FROM users u
       LEFT JOIN payments p ON p.user_id = u.id AND p.status = 'completed'
       WHERE u.is_premium = TRUE AND u.premium_expiry <= ? AND u.premium_expiry > CURDATE()
       ORDER BY u.premium_expiry ASC`,
      [expiryDateStr]
    );
    return rows;
  }
}

export default Payment;