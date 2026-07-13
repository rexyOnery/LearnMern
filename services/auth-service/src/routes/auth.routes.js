import { Router } from 'express';
import { validate as validateRequest } from '@mern-microservices/shared';
import {
  login,
  register,
  validate
} from '../controllers/auth.controller.js';
import {
  loginSchema,
  registerSchema
} from '../validation/auth.validation.js';

export const authRouter = Router();

authRouter.post('/register', validateRequest(registerSchema), register);
authRouter.post('/login', validateRequest(loginSchema), login);
authRouter.get('/validate', validate);
