import express from 'express';
import { getReferrals, createReferral } from '../controller/referralController.js';
import { requireAuth } from '@clerk/express';

const referralRouter = express.Router();

referralRouter.get('/', requireAuth(), getReferrals);
referralRouter.post('/', requireAuth(), createReferral);

export default referralRouter;
