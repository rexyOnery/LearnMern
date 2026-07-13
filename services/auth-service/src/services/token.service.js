import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const createAccessToken = (user) =>
  jwt.sign(
    {
      email: user.email,
      name: user.name
    },
    env.jwtSecret,
    {
      subject: user._id.toString(),
      expiresIn: env.jwtExpiresIn
    }
  );

export const verifyAccessToken = (token) => jwt.verify(token, env.jwtSecret);
