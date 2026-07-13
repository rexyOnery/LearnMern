import { ApiError, asyncHandler } from '@mern-microservices/shared';
import {
  loginUser,
  registerUser,
  validateToken
} from '../services/auth.service.js';

const readBearerToken = (authorization = '') => {
  const [scheme, token] = authorization.split(' ');
  return scheme === 'Bearer' && token ? token : null;
};

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: result
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);

  res.json({
    success: true,
    message: 'Login successful',
    data: result
  });
});

export const validate = asyncHandler(async (req, res) => {
  const token = readBearerToken(req.headers.authorization);

  if (!token) {
    throw new ApiError(401, 'Missing bearer token');
  }

  const user = await validateToken(token);

  res.json({
    success: true,
    data: { user }
  });
});
