import express from 'express';
import { extractStats, getProfile, rechargeCredits, updateProfile, uploadResume } from '../controller/profileController.js';
import { schemaValidator } from '../middlleware/schemaValidator.js';
import { RechargeCreditsSchema, UpdateProfileSchema } from '../schema/profileSchema.js';

const profileRouter = express.Router();

profileRouter.get('/', getProfile);
profileRouter.patch('/', schemaValidator(UpdateProfileSchema), updateProfile);
profileRouter.put('/resume', uploadResume);
profileRouter.post('/credits/transaction', schemaValidator(RechargeCreditsSchema), rechargeCredits);
profileRouter.get('/stats', extractStats);

export default profileRouter;
