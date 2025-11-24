import express from 'express';
import { getFollowups, updateFollowup, deleteFollowup } from '../controller/followupController.js';
import { requireAuth } from '@clerk/express';

const followupRouter = express.Router();

followupRouter.get('/', requireAuth(), getFollowups);
followupRouter.put('/:id', requireAuth(), updateFollowup);
followupRouter.delete('/:id', requireAuth(), deleteFollowup);

export default followupRouter;
