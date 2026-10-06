import { pool } from '../config/database.js';

export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const [result] = await pool.query(
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );
    return res.status(201).json({ success: true, message: 'Message received. We will get back soon.', data: { id: result.insertId } });
  } catch (error) {
    console.error('Submit contact error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit message' });
  }
};

export const listContacts = async (req, res) => {
  try {
    const { status = 'new', limit = 50, offset = 0 } = req.query;
    const [rows] = await pool.query(
      'SELECT * FROM contact_messages WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [status, parseInt(limit), parseInt(offset)]
    );
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('List contacts error:', error);
    return res.status(500).json({ success: false, message: 'Failed to list contacts' });
  }
};

export const resolveContact = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE contact_messages SET status = ? WHERE id = ?', ['resolved', id]);
    return res.status(200).json({ success: true, message: 'Contact marked resolved' });
  } catch (error) {
    console.error('Resolve contact error:', error);
    return res.status(500).json({ success: false, message: 'Failed to resolve contact' });
  }
};