import {
  buildCorsOrigins,
  loadEnvFiles,
  requireEnv
} from '@mern-microservices/shared';

loadEnvFiles();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4103),
  mongodbUri:
    process.env.PRODUCT_MONGODB_URI ||
    requireEnv('MONGODB_URI', 'mongodb://localhost:27017/product_service'),
  jwtSecret: requireEnv('JWT_SECRET', 'replace-with-a-long-random-secret'),
  corsOrigins: buildCorsOrigins(process.env.CORS_ORIGIN || 'http://localhost:4000')
};
