import 'dotenv/config';
import { parseCorsOrigins, requireEnv } from '@mern-microservices/shared';

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  jwtSecret: requireEnv('JWT_SECRET', 'replace-with-a-long-random-secret'),
  authServiceUrl: requireEnv('AUTH_SERVICE_URL', 'http://localhost:4101'),
  userServiceUrl: requireEnv('USER_SERVICE_URL', 'http://localhost:4102'),
  productServiceUrl: requireEnv('PRODUCT_SERVICE_URL', 'http://localhost:4103'),
  corsOrigins: parseCorsOrigins(
    process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000'
  ),
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 120)
};
