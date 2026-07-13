import bcrypt from 'bcryptjs';
import { ApiError } from '@mern-microservices/shared';
import { User } from '../models/user.model.js';
import { createAccessToken, verifyAccessToken } from './token.service.js';

const publicUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, 'Email is already registered');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });

  return {
    user: publicUser(user),
    token: createAccessToken(user)
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  return {
    user: publicUser(user),
    token: createAccessToken(user)
  };
};

export const validateToken = async (token) => {
  const payload = verifyAccessToken(token);
  const user = await User.findById(payload.sub);

  if (!user) {
    throw new ApiError(401, 'Token user no longer exists');
  }

  return publicUser(user);
};
