import jwt from 'jsonwebtoken';
import { ApiError } from '@mern-microservices/shared';
import { env } from '../config/env.js';

const readBearerToken = (authorization = '') => {
  const [scheme, token] = authorization.split(' ');
  return scheme === 'Bearer' && token ? token : null;
};

export const requireAuth = (req, _res, next) => {
  const token = readBearerToken(req.headers.authorization);

  if (!token) {
    next(new ApiError(401, 'Missing bearer token'));
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);

    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name
    };

    req.headers['x-user-id'] = payload.sub;
    req.headers['x-user-email'] = payload.email || '';
    req.headers['x-user-name'] = payload.name || '';

    next();
  } catch (_error) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};

export const requireAuthForUnsafeMethods = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    next();
    return;
  }

  requireAuth(req, res, next);
};
