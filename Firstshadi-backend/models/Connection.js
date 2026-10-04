import { pool } from '../config/database.js';

export class Connection {
  static async create(fromUserId, toUserId, message = null) {
    // Check if connection already exists
    const [existing] = await pool.query(
      'SELECT * FROM connections WHERE (from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?)',
      [fromUserId, toUserId, toUserId, fromUserId]
    );

    if (existing.length > 0) {
      return existing[0];
    }

    const [result] = await pool.query(
      `INSERT INTO connections (from_user_id, to_user_id, message)
       VALUES (?, ?, ?)`,
      [fromUserId, toUserId, message]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT c.*, 
       u1.name as from_user_name, u1.email as from_user_email, u1.uuid as from_user_uuid,
       u2.name as to_user_name, u2.email as to_user_email, u2.uuid as to_user_uuid,
       u1.is_premium as from_user_premium, u2.is_premium as to_user_premium
       FROM connections c
       LEFT JOIN users u1 ON c.from_user_id = u1.id
       LEFT JOIN users u2 ON c.to_user_id = u2.id
       WHERE c.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  static async updateStatus(id, status) {
    await pool.query(
      'UPDATE connections SET status = ? WHERE id = ?',
      [status, id]
    );
    return this.findById(id);
  }

  static async getForUser(userId, status = null) {
    let query = `
      SELECT c.*, 
       u1.name as from_user_name, u1.email as from_user_email, u1.uuid as from_user_uuid,
       u1.is_premium as from_user_premium,
       u2.name as to_user_name, u2.email as to_user_email, u2.uuid as to_user_uuid,
       u2.is_premium as to_user_premium,
       (SELECT COUNT(*) FROM messages m WHERE m.connection_id = c.id AND m.receiver_id = ? AND m.is_read = FALSE) as unread_count
      FROM connections c
      LEFT JOIN users u1 ON c.from_user_id = u1.id
      LEFT JOIN users u2 ON c.to_user_id = u2.id
      WHERE c.from_user_id = ? OR c.to_user_id = ?
    `;
    
    const params = [userId, userId, userId];

    if (status) {
      query += ' AND c.status = ?';
      params.push(status);
    }

    query += ' ORDER BY c.updated_at DESC';

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async getPendingRequests(userId) {
    const [rows] = await pool.query(
      `SELECT c.*, 
       u1.name as from_user_name, u1.email as from_user_email, u1.uuid as from_user_uuid,
       u1.is_premium as from_user_premium,
       u2.name as to_user_name, u2.email as to_user_email, u2.uuid as to_user_uuid,
       u2.is_premium as to_user_premium
       FROM connections c
       LEFT JOIN users u1 ON c.from_user_id = u1.id
       LEFT JOIN users u2 ON c.to_user_id = u2.id
       WHERE c.to_user_id = ? AND c.status = 'pending'
       ORDER BY c.created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async getAcceptedConnections(userId) {
    const [rows] = await pool.query(
      `SELECT c.*, 
       u1.name as from_user_name, u1.email as from_user_email, u1.uuid as from_user_uuid,
       u1.is_premium as from_user_premium,
       u2.name as to_user_name, u2.email as to_user_email, u2.uuid as to_user_uuid,
       u2.is_premium as to_user_premium,
       (SELECT COUNT(*) FROM messages m WHERE m.connection_id = c.id AND m.receiver_id = ? AND m.is_read = FALSE) as unread_count
       FROM connections c
       LEFT JOIN users u1 ON c.from_user_id = u1.id
       LEFT JOIN users u2 ON c.to_user_id = u2.id
       WHERE (c.from_user_id = ? OR c.to_user_id = ?) AND c.status = 'accepted'
       ORDER BY c.updated_at DESC`,
      [userId, userId, userId]
    );
    return rows;
  }

  static async getConnectionBetween(userId1, userId2) {
    const [rows] = await pool.query(
      `SELECT * FROM connections 
       WHERE (from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?)`,
      [userId1, userId2, userId2, userId1]
    );
    return rows[0] || null;
  }

  static async delete(id) {
    await pool.query('DELETE FROM connections WHERE id = ?', [id]);
    return true;
  }

  static async getReceivedRequests(userId) {
    const [rows] = await pool.query(
      `SELECT c.*, 
       u1.name as from_user_name, u1.email as from_user_email, u1.uuid as from_user_uuid,
       u1.is_premium as from_user_premium,
       u2.name as to_user_name, u2.email as to_user_email, u2.uuid as to_user_uuid,
       u2.is_premium as to_user_premium
       FROM connections c
       LEFT JOIN users u1 ON c.from_user_id = u1.id
       LEFT JOIN users u2 ON c.to_user_id = u2.id
       WHERE c.to_user_id = ? AND c.status = 'pending'
       ORDER BY c.created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async getSentRequests(userId) {
    const [rows] = await pool.query(
      `SELECT c.*, 
       u1.name as from_user_name, u1.email as from_user_email, u1.uuid as from_user_uuid,
       u1.is_premium as from_user_premium,
       u2.name as to_user_name, u2.email as to_user_email, u2.uuid as to_user_uuid,
       u2.is_premium as to_user_premium
       FROM connections c
       LEFT JOIN users u1 ON c.from_user_id = u1.id
       LEFT JOIN users u2 ON c.to_user_id = u2.id
       WHERE c.from_user_id = ? AND c.status = 'pending'
       ORDER BY c.created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async getCount(userId, status = null) {
    let query = 'SELECT COUNT(*) as total FROM connections WHERE from_user_id = ? OR to_user_id = ?';
    const params = [userId, userId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }

  static async getMutualConnections(userId1, userId2) {
    // Get connections of both users and find mutual
    const [rows] = await pool.query(
      `SELECT DISTINCT u.id, u.uuid, u.name, u.email, u.phone, u.is_premium
       FROM users u
       WHERE u.id IN (
         SELECT CASE 
           WHEN c.from_user_id = ? THEN c.to_user_id
           ELSE c.from_user_id
         END
         FROM connections c
         WHERE (c.from_user_id = ? OR c.to_user_id = ?) AND c.status = 'accepted'
       )
       AND u.id IN (
         SELECT CASE 
           WHEN c.from_user_id = ? THEN c.to_user_id
           ELSE c.from_user_id
         END
         FROM connections c
         WHERE (c.from_user_id = ? OR c.to_user_id = ?) AND c.status = 'accepted'
       )
       AND u.id != ? AND u.id != ?`,
      [userId1, userId1, userId1, userId2, userId2, userId2, userId1, userId2]
    );
    return rows;
  }
}

export default Connection;