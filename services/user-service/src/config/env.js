import 'dotenv/config';
import { parseCorsOrigins, requireEnv } from '@mern-microservices/shared';

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4102),
  mongodbUri:
    process.env.USER_MONGODB_URI ||
    requireEnv('MONGODB_URI', 'mongodb://localhost:27017/user_service'),
  jwtSecret: requireEnv('JWT_SECRET', 'replace-with-a-long-random-secret'),
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGIN || 'http://localhost:4000')
};
