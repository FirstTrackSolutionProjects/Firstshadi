import express from 'express';
import {
  createProfile,
  updateProfile,
  getMyProfile,
  getProfileByUuid,
  searchProfiles,
  getMatches,
  uploadPhotos,
  deletePhoto,
  deleteProfile
} from '../controllers/profileController.js';
import { authenticate, requirePremium } from '../middleware/auth.js';
import { uploadPhotos as uploadMiddleware } from '../middleware/upload.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Profile CRUD
router.post('/', createProfile);
router.put('/', updateProfile);
router.get('/me', getMyProfile);
router.delete('/', deleteProfile);

// Get profile by UUID
router.get('/user/:uuid', getProfileByUuid);

// Search and matches
router.get('/search', searchProfiles);
router.get('/matches', requirePremium, getMatches);

// Photos
router.post('/photos', uploadMiddleware, uploadPhotos);
router.delete('/photos/:photoIndex', deletePhoto);

export default router;