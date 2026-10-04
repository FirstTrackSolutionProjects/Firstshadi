import express from 'express';
import {
  sendMessage,
  getMessages,
  getConversations,
  getUnreadCount,
  markMessageAsRead
} from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/unread-count', getUnreadCount);
router.get('/:connectionId', getMessages);
router.put('/:messageId/read', markMessageAsRead);

export default router;