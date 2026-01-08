import express from 'express';
import multer from 'multer';
import { getProfile, rechargeCredits, updateProfile, uploadResume } from '../controller/profileController.js';
import { requireAuth } from '../middlleware/requireAuth.js';

const profileRouter = express.Router();

profileRouter.get('/', getProfile);
profileRouter.patch('/', updateProfile);
profileRouter.post('/upload/resume', uploadResume);
profileRouter.patch('/rechargeCredits', rechargeCredits);

export default profileRouter;
