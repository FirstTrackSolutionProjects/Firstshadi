import express from 'express';
import {
  getPublishedStories,
  createStory,
  listStories,
  updateStory,
  deleteStory,
} from '../controllers/successStoryController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getPublishedStories);

// Admin
router.get('/admin', authenticate, requireAdmin, listStories);
router.post('/admin', authenticate, requireAdmin, createStory);
router.put('/admin/:id', authenticate, requireAdmin, updateStory);
router.delete('/admin/:id', authenticate, requireAdmin, deleteStory);

export default router;