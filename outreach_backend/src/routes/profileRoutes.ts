import express from 'express';
import multer from 'multer';
import { getProfile, rechargeCredits, updateProfile, uploadResume } from '../controller/profileController.js';
import { requireAuth } from '../middlleware/requireAuth.js';

import { schemaValidator } from '../middlleware/schemaValidator.js';
import { RechargeCreditsSchema, UpdateProfileSchema } from '../schema/profileSchema.js';

const profileRouter = express.Router();

profileRouter.get('/', getProfile);
profileRouter.patch('/', schemaValidator(UpdateProfileSchema), updateProfile);
profileRouter.post('/upload/resume', uploadResume);
profileRouter.patch('/rechargeCredits', schemaValidator(RechargeCreditsSchema), rechargeCredits);

export default profileRouter;
