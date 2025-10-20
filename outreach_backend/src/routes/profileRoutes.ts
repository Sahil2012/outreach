import express from 'express';
import multer from 'multer';
import { requireAuth } from '../middlleware/requireAuth.js';
import { getProfile, updateProfile } from '../controller/profileController.js';

const router = express.Router();
const upload = multer();

router.get('/me', requireAuth, getProfile);
router.put('/update', requireAuth, updateProfile);
router.post('/upload/resume', requireAuth, upload.single('resume'), updateProfile);

export default router;
