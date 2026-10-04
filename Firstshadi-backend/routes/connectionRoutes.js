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

const router = express.Router();

router.use(authenticate);

// Send connection request
router.post('/request', sendRequest);

// Get requests
router.get('/received', getReceivedRequests);
router.get('/sent', getSentRequests);
router.get('/accepted', getAcceptedConnections);

// Accept/Decline/Block
router.put('/:connectionId/accept', acceptRequest);
router.put('/:connectionId/decline', declineRequest);
router.put('/block/:targetUserId', blockUser);

export default router;