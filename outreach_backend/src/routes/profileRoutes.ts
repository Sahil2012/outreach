import express from 'express';
import multer from 'multer';
import { getProfile, updateProfile, uploadResume } from '../controller/profileController.js';
import { requireAuth } from '../middlleware/requireAuth.js';

const profileRouter = express.Router();
const upload = multer();
profileRouter.get('/', requireAuth, getProfile);
profileRouter.patch('/', requireAuth, updateProfile);
profileRouter.post('/upload/resume', requireAuth, upload.single('resume'), uploadResume);

export default profileRouter;
