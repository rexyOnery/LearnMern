import { Router } from 'express';
import { validate } from '@mern-microservices/shared';
import {
  getProfile,
  patchProfile
} from '../controllers/profile.controller.js';
import { requireIdentity } from '../middleware/identity.middleware.js';
import { updateProfileSchema } from '../validation/profile.validation.js';

export const userRouter = Router();

userRouter.use(requireIdentity);
userRouter.get('/profile', getProfile);
userRouter.patch('/profile', validate(updateProfileSchema), patchProfile);
