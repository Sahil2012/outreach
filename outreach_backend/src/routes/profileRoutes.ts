import express from 'express';
import multer from 'multer';
import { checkReadiness, getProfile, updateProfile, uploadResume, getProfileDetails, updateProfileDetails, deleteProfileItem } from '../controller/profileController.js';
import { requireAuth } from '@clerk/express';

const profileRouter = express.Router();
const upload = multer();

profileRouter.get('/', requireAuth(), getProfile);
profileRouter.put('/update', requireAuth(), updateProfile);
profileRouter.post('/upload/resume',requireAuth(), upload.single('resume'), uploadResume);
profileRouter.get('/readiness',requireAuth(), checkReadiness);

// New routes for profile details (skills, projects, education)
profileRouter.get('/details', requireAuth(), getProfileDetails);
profileRouter.put('/details', requireAuth(), updateProfileDetails);
profileRouter.delete('/item/:type/:id', requireAuth(), deleteProfileItem);

export default profileRouter;
