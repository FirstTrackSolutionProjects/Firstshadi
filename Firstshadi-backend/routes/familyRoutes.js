import express from 'express';
import { saveFamilyMembers, getFamilyMembers } from '../controllers/familyController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getFamilyMembers);
router.post('/', saveFamilyMembers);

export default router;