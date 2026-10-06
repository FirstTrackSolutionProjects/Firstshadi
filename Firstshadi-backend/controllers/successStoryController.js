import { pool } from '../config/database.js';

// Public: get published success stories
export const getPublishedStories = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, couple_names, image_url, story, location, married_on
       FROM success_stories
       WHERE is_published = TRUE
       ORDER BY created_at DESC
       LIMIT 20`
    );
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Get stories error:', error);
    return res.status(500).json({ success: false, message: 'Failed to get stories' });
  }
};

// Admin: create story
export const createStory = async (req, res) => {
  try {
    const { couple_names, image_url, story, location, married_on, is_published } = req.body;
    if (!couple_names || !story) {
      return res.status(400).json({ success: false, message: 'couple_names and story are required' });
    }
    const [result] = await pool.query(
      `INSERT INTO success_stories (couple_names, image_url, story, location, married_on, is_published)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [couple_names, image_url || null, story, location || null, married_on || null, is_published !== false]
    );
    return res.status(201).json({ success: true, message: 'Story created', data: { id: result.insertId } });
  } catch (error) {
    console.error('Create story error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create story' });
  }
};

// Admin: list all stories (including unpublished)
export const listStories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM success_stories ORDER BY created_at DESC');
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('List stories error:', error);
    return res.status(500).json({ success: false, message: 'Failed to list stories' });
  }
};

// Admin: update
export const updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { couple_names, image_url, story, location, married_on, is_published } = req.body;
    await pool.query(
      `UPDATE success_stories
       SET couple_names = COALESCE(?, couple_names),
           image_url = COALESCE(?, image_url),
           story = COALESCE(?, story),
           location = COALESCE(?, location),
           married_on = COALESCE(?, married_on),
           is_published = COALESCE(?, is_published)
       WHERE id = ?`,
      [couple_names, image_url, story, location, married_on, is_published, id]
    );
    return res.status(200).json({ success: true, message: 'Story updated' });
  } catch (error) {
    console.error('Update story error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update story' });
  }
};

// Admin: delete
export const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM success_stories WHERE id = ?', [id]);
    return res.status(200).json({ success: true, message: 'Story deleted' });
  } catch (error) {
    console.error('Delete story error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete story' });
  }
};