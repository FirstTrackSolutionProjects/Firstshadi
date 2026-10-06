import express from 'express';
import {
  sendRequest,
  acceptRequest,
  declineRequest,
  getReceivedRequests,
  getSentRequests,
  getAcceptedConnections,
  blockUser
} from '../controllers/connectionController.js';
import { authenticate } from '../middleware/auth.js';
import { pool } from '../config/database.js';

const router = express.Router();

router.use(authenticate);

router.post('/request', sendRequest);
router.get('/received', getReceivedRequests);
router.get('/sent', getSentRequests);
router.get('/accepted', getAcceptedConnections);
router.put('/:connectionId/accept', acceptRequest);
router.put('/:connectionId/decline', declineRequest);
router.put('/block/:targetUserId', blockUser);

router.put('/unblock/:targetUserId', async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetUserId } = req.params;
    const [users] = await pool.query('SELECT id FROM users WHERE uuid = ?', [targetUserId]);
    if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    const targetId = users[0].id;

    await pool.query(
      "UPDATE connections SET status = 'declined' WHERE (from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?) AND status = 'blocked'",
      [userId, targetId, targetId, userId]
    );
    return res.status(200).json({ success: true, message: 'User unblocked' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: 'Failed to unblock' });
  }
});

export default router;




// import express from 'express';
// import {
//   sendRequest,
//   acceptRequest,
//   declineRequest,
//   getReceivedRequests,
//   getSentRequests,
//   getAcceptedConnections,
//   blockUser
// } from '../controllers/connectionController.js';
// import { authenticate } from '../middleware/auth.js';

// const router = express.Router();

// router.use(authenticate);

// // Send connection request
// router.post('/request', sendRequest);

// // Get requests
// router.get('/received', getReceivedRequests);
// router.get('/sent', getSentRequests);
// router.get('/accepted', getAcceptedConnections);

// // Accept/Decline/Block
// router.put('/:connectionId/accept', acceptRequest);
// router.put('/:connectionId/decline', declineRequest);
// router.put('/block/:targetUserId', blockUser);

// export default router;