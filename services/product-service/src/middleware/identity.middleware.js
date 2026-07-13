import jwt from 'jsonwebtoken';
import { ApiError } from '@mern-microservices/shared';
import { env } from '../config/env.js';

const readBearerToken = (authorization = '') => {
  const [scheme, token] = authorization.split(' ');
  return scheme === 'Bearer' && token ? token : null;
};

export const requireIdentity = (req, _res, next) => {
  const gatewayUserId = req.headers['x-user-id'];

  if (gatewayUserId) {
    req.identity = {
      id: gatewayUserId,
      email: req.headers['x-user-email'] || '',
      name: req.headers['x-user-name'] || 'User'
    };
    next();
    return;
  }

  const token = readBearerToken(req.headers.authorization);

  if (!token) {
    next(new ApiError(401, 'Missing authenticated identity'));
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.identity = {
      id: payload.sub,
      email: payload.email || '',
      name: payload.name || 'User'
    };
    next();
  } catch (_error) {
    next(new ApiError(401, 'Invalid authenticated identity'));
  }
};
