import { pool } from '../config/database.js';
import Profile from '../models/Profile.js';

// Add / update family members for the current user's profile
export const saveFamilyMembers = async (req, res) => {
  try {
    const userId = req.user.id;
    const { family_members } = req.body; // [{ relation, name, job, occupation, qualification, is_married }]

    if (!Array.isArray(family_members)) {
      return res.status(400).json({ success: false, message: 'family_members must be an array' });
    }

    const profile = await Profile.findByUserId(userId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found. Create profile first.' });
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Clear existing
      await conn.query('DELETE FROM family_members WHERE profile_id = ?', [profile.id]);

      // Insert new
      for (const m of family_members) {
        if (!m.relation || !m.name) continue;
        await conn.query(
          `INSERT INTO family_members (profile_id, relation, name, job, occupation, qualification, is_married)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            profile.id,
            m.relation,
            m.name,
            m.job || null,
            m.occupation || null,
            m.qualification || null,
            !!m.is_married,
          ]
        );
      }

      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

    const updated = await Profile.findByUserId(userId);
    return res.status(200).json({ success: true, message: 'Family members saved', data: updated });
  } catch (error) {
    console.error('Save family members error:', error);
    return res.status(500).json({ success: false, message: 'Failed to save family members' });
  }
};

// Get family members of a profile
export const getFamilyMembers = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await Profile.findByUserId(userId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    return res.status(200).json({ success: true, data: profile.family_members || [] });
  } catch (error) {
    console.error('Get family members error:', error);
    return res.status(500).json({ success: false, message: 'Failed to get family members' });
  }
};