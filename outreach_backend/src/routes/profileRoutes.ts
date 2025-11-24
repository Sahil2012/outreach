import express from 'express';
import multer from 'multer';
import { checkReadiness, getProfile, updateProfile, uploadResume } from '../controller/profileController.js';
import { requireAuth } from '@clerk/express';

const profileRouter = express.Router();
const upload = multer();

profileRouter.get('/me', requireAuth(), getProfile);
profileRouter.put('/update', requireAuth(), updateProfile);
profileRouter.post('/upload/resume',requireAuth(), upload.single('resume'), uploadResume);
profileRouter.get('/readiness',requireAuth(), checkReadiness);

export default profileRouter;
