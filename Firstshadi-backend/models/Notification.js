import { pool } from '../config/database.js';

export class Notification {
  static async create(userId, type, title, message, data = null) {
    const [result] = await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, data)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, type, title, message, data ? JSON.stringify(data) : null]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return null;
    const notification = rows[0];
    if (notification.data) {
      notification.data = JSON.parse(notification.data);
    }
    return notification;
  }

  static async getForUser(userId, isRead = null, limit = 50, offset = 0) {
    let query = 'SELECT * FROM notifications WHERE user_id = ?';
    const params = [userId];

    if (isRead !== null) {
      query += ' AND is_read = ?';
      params.push(isRead);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    const notifications = rows.map(n => {
      if (n.data) n.data = JSON.parse(n.data);
      return n;
    });

    // Get unread count
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );

    return {
      data: notifications,
      unread_count: countResult[0].unread_count,
      pagination: { limit, offset }
    };
  }

  static async markAsRead(id) {
    await pool.query(
      'UPDATE notifications SET is_read = TRUE, read_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
    return this.findById(id);
  }

  static async markAllAsRead(userId) {
    await pool.query(
      'UPDATE notifications SET is_read = TRUE, read_at = CURRENT_TIMESTAMP WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );
    return true;
  }

  static async delete(id) {
    await pool.query('DELETE FROM notifications WHERE id = ?', [id]);
    return true;
  }

  static async deleteAll(userId) {
    await pool.query('DELETE FROM notifications WHERE user_id = ?', [userId]);
    return true;
  }
}

export default Notification;