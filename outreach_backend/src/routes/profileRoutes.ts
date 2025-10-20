import express from 'express';
import multer from 'multer';
import { requireAuth } from '../middlleware/requireAuth.js';
import { getProfile, updateProfile, uploadResume } from '../controller/profileController.js';

const profileRouter = express.Router();
const upload = multer();

profileRouter.get('/me', requireAuth, getProfile);
profileRouter.put('/update', requireAuth, updateProfile);
profileRouter.post('/upload/resume',requireAuth, upload.single('resume'), uploadResume);

export default profileRouter;
