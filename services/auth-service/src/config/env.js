import 'dotenv/config';
import { buildCorsOrigins, requireEnv } from '@mern-microservices/shared';

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4101),
  mongodbUri:
    process.env.AUTH_MONGODB_URI ||
    requireEnv('MONGODB_URI', 'mongodb://localhost:27017/auth_service'),
  jwtSecret: requireEnv('JWT_SECRET', 'replace-with-a-long-random-secret'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  corsOrigins: buildCorsOrigins(process.env.CORS_ORIGIN || 'http://localhost:4000')
};
