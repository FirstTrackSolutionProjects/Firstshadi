import { pool } from '../config/database.js';

export class Message {
  static async create(connectionId, senderId, receiverId, message) {
    const [result] = await pool.query(
      `INSERT INTO messages (connection_id, sender_id, receiver_id, message)
       VALUES (?, ?, ?, ?)`,
      [connectionId, senderId, receiverId, message]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT m.*, 
       u1.name as sender_name, u1.email as sender_email,
       u2.name as receiver_name, u2.email as receiver_email
       FROM messages m
       LEFT JOIN users u1 ON m.sender_id = u1.id
       LEFT JOIN users u2 ON m.receiver_id = u2.id
       WHERE m.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  static async getForConnection(connectionId, limit = 50, offset = 0) {
    const [rows] = await pool.query(
      `SELECT m.*, 
       u1.name as sender_name, u1.email as sender_email,
       u2.name as receiver_name, u2.email as receiver_email
       FROM messages m
       LEFT JOIN users u1 ON m.sender_id = u1.id
       LEFT JOIN users u2 ON m.receiver_id = u2.id
       WHERE m.connection_id = ?
       ORDER BY m.created_at DESC
       LIMIT ? OFFSET ?`,
      [connectionId, limit, offset]
    );

    return rows.reverse();
  }

  static async markAsRead(messageId) {
    await pool.query(
      'UPDATE messages SET is_read = TRUE, read_at = CURRENT_TIMESTAMP WHERE id = ?',
      [messageId]
    );
    return this.findById(messageId);
  }

  static async markAllAsRead(connectionId, userId) {
    await pool.query(
      'UPDATE messages SET is_read = TRUE, read_at = CURRENT_TIMESTAMP WHERE connection_id = ? AND receiver_id = ? AND is_read = FALSE',
      [connectionId, userId]
    );
    return true;
  }

  static async getUnreadCount(userId) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = FALSE',
      [userId]
    );
    return rows[0].count;
  }

  static async delete(id) {
    await pool.query('DELETE FROM messages WHERE id = ?', [id]);
    return true;
  }

  static async getConversations(userId) {
    const [rows] = await pool.query(
      `SELECT 
        c.id as connection_id,
        CASE 
          WHEN c.from_user_id = ? THEN c.to_user_id
          ELSE c.from_user_id
        END as other_user_id,
        u.name as other_user_name,
        u.email as other_user_email,
        (SELECT m.message FROM messages m WHERE m.connection_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message,
        (SELECT m.created_at FROM messages m WHERE m.connection_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message_time,
        (SELECT COUNT(*) FROM messages m WHERE m.connection_id = c.id AND m.receiver_id = ? AND m.is_read = FALSE) as unread_count
      FROM connections c
      LEFT JOIN users u ON (CASE 
        WHEN c.from_user_id = ? THEN c.to_user_id
        ELSE c.from_user_id
      END = u.id)
      WHERE (c.from_user_id = ? OR c.to_user_id = ?) AND c.status = 'accepted'
      ORDER BY last_message_time DESC`,
      [userId, userId, userId, userId, userId]
    );

    return rows;
  }
}

export default Message;