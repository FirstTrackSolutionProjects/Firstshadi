import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export class User {
  static async create(userData) {
    const { email, password, name, phone, profile_for, gender } = userData;
    const uuid = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (uuid, email, password_hash, name, phone, profile_for, gender)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [uuid, email, passwordHash, name, phone, profile_for || 'Myself', gender]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  }

  static async findByPhone(phone) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE phone = ?',
      [phone]
    );
    return rows[0] || null;
  }

  static async findByUuid(uuid) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE uuid = ?',
      [uuid]
    );
    return rows[0] || null;
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    if (data.name) { fields.push('name = ?'); values.push(data.name); }
    if (data.phone) { fields.push('phone = ?'); values.push(data.phone); }
    if (data.profile_for) { fields.push('profile_for = ?'); values.push(data.profile_for); }
    if (data.gender !== undefined) { fields.push('gender = ?'); values.push(data.gender); }
    if (data.is_verified !== undefined) { fields.push('is_verified = ?'); values.push(data.is_verified); }
    if (data.is_premium !== undefined) { fields.push('is_premium = ?'); values.push(data.is_premium); }
    if (data.premium_expiry) { fields.push('premium_expiry = ?'); values.push(data.premium_expiry); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password_hash);
  }

  static async delete(id) {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return true;
  }

  static async getProfile(userId) {
    const [rows] = await pool.query(
      `SELECT u.*, p.*, 
       GROUP_CONCAT(DISTINCT fm.id) as family_members
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       LEFT JOIN family_members fm ON p.id = fm.profile_id
       WHERE u.id = ?
       GROUP BY u.id`,
      [userId]
    );
    return rows[0] || null;
  }

  static async updatePassword(userId, newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [passwordHash, userId]
    );
    return true;
  }

  static async getAll(filters = {}) {
    let query = 'SELECT * FROM users WHERE 1=1';
    const params = [];

    if (filters.is_verified !== undefined) {
      query += ' AND is_verified = ?';
      params.push(filters.is_verified);
    }

    if (filters.is_premium !== undefined) {
      query += ' AND is_premium = ?';
      params.push(filters.is_premium);
    }

    if (filters.gender) {
      query += ' AND gender = ?';
      params.push(filters.gender);
    }

    if (filters.search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async getCount(filters = {}) {
    let query = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const params = [];

    if (filters.is_verified !== undefined) {
      query += ' AND is_verified = ?';
      params.push(filters.is_verified);
    }

    if (filters.is_premium !== undefined) {
      query += ' AND is_premium = ?';
      params.push(filters.is_premium);
    }

    if (filters.gender) {
      query += ' AND gender = ?';
      params.push(filters.gender);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }
}

export default User;