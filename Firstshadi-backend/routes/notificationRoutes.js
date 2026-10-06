import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications
} from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';
import { pool } from '../config/database.js';

const router = express.Router();

router.use(authenticate);

router.get('/unread-count', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [req.user.id]
    );
    return res.status(200).json({ success: true, data: { unread_count: rows[0].count } });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Failed to get unread count' });
  }
});

router.get('/', getNotifications);
router.put('/:notificationId/read', markAsRead);
router.put('/read-all', markAllAsRead);
router.delete('/:notificationId', deleteNotification);
router.delete('/', deleteAllNotifications);

export default router;



// import express from 'express';
// import {
//   getNotifications,
//   markAsRead,
//   markAllAsRead,
//   deleteNotification,
//   deleteAllNotifications
// } from '../controllers/notificationController.js';
// import { authenticate } from '../middleware/auth.js';

// const router = express.Router();

// router.use(authenticate);

// router.get('/', getNotifications);
// router.put('/:notificationId/read', markAsRead);
// router.put('/read-all', markAllAsRead);
// router.delete('/:notificationId', deleteNotification);
// router.delete('/', deleteAllNotifications);

// export default router;