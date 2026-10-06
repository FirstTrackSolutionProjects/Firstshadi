import express from 'express';
import { submitContact, listContacts, resolveContact } from '../controllers/contactController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public
router.post('/', submitContact);

// Admin
router.get('/admin', authenticate, requireAdmin, listContacts);
router.put('/admin/:id/resolve', authenticate, requireAdmin, resolveContact);

export default router;