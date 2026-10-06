import { pool } from '../config/database.js';

// Report a profile
export const createReport = async (req, res) => {
  try {
    const reporterId = req.user.id;
    const { reported_user_uuid, reason, details } = req.body;

    if (!reported_user_uuid || !reason) {
      return res.status(400).json({ success: false, message: 'reported_user_uuid and reason are required' });
    }

    const [users] = await pool.query('SELECT id FROM users WHERE uuid = ?', [reported_user_uuid]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Reported user not found' });
    }

    const reportedId = users[0].id;

    if (reportedId === reporterId) {
      return res.status(400).json({ success: false, message: 'You cannot report yourself' });
    }

    const [result] = await pool.query(
      `INSERT INTO reports (reporter_id, reported_user_id, reason, details)
       VALUES (?, ?, ?, ?)`,
      [reporterId, reportedId, reason, details || null]
    );

    return res.status(201).json({
      success: true,
      message: 'Report submitted. Our team will review it.',
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error('Create report error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit report' });
  }
};

// Admin: list reports
export const listReports = async (req, res) => {
  try {
    const { status = 'pending', limit = 50, offset = 0 } = req.query;
    const [rows] = await pool.query(
      `SELECT r.*,
        u1.name as reporter_name, u1.email as reporter_email,
        u2.name as reported_name, u2.email as reported_email, u2.uuid as reported_uuid
       FROM reports r
       LEFT JOIN users u1 ON r.reporter_id = u1.id
       LEFT JOIN users u2 ON r.reported_user_id = u2.id
       WHERE r.status = ?
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [status, parseInt(limit), parseInt(offset)]
    );
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('List reports error:', error);
    return res.status(500).json({ success: false, message: 'Failed to list reports' });
  }
};

// Admin: resolve report
export const resolveReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, action } = req.body; // status: reviewed | dismissed | action_taken; action: none | suspend | delete
    await pool.query('UPDATE reports SET status = ?, resolved_at = CURRENT_TIMESTAMP WHERE id = ?', [status || 'reviewed', reportId]);

    if (action === 'suspend' || action === 'delete') {
      const [reports] = await pool.query('SELECT reported_user_id FROM reports WHERE id = ?', [reportId]);
      if (reports.length) {
        if (action === 'suspend') {
          await pool.query('UPDATE users SET is_active = FALSE WHERE id = ?', [reports[0].reported_user_id]);
        } else if (action === 'delete') {
          await pool.query('DELETE FROM users WHERE id = ?', [reports[0].reported_user_id]);
        }
      }
    }

    return res.status(200).json({ success: true, message: 'Report resolved' });
  } catch (error) {
    console.error('Resolve report error:', error);
    return res.status(500).json({ success: false, message: 'Failed to resolve report' });
  }
};