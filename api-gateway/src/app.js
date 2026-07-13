import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import {
  buildHealthResponse,
  createCorsOptions,
  errorHandler,
  notFoundHandler
} from '@mern-microservices/shared';
import { env } from './config/env.js';
import {
  requireAuth,
  requireAuthForUnsafeMethods
} from './middleware/auth.middleware.js';
import { createServiceProxy } from './proxy/create-service-proxy.js';

export const createApp = () => {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors(createCorsOptions({ origins: env.corsOrigins })));
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
  app.use(
    rateLimit({
      windowMs: env.rateLimitWindowMs,
      max: env.rateLimitMax,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.get('/health', (_req, res) => {
    res.json({
      ...buildHealthResponse('api-gateway'),
      upstreams: {
        auth: env.authServiceUrl,
        users: env.userServiceUrl,
        products: env.productServiceUrl
      }
    });
  });

  app.use(
    '/api/auth',
    createServiceProxy({
      target: env.authServiceUrl,
      pathRewrite: { '^/api/auth': '/auth' }
    })
  );

  app.use(
    '/api/users',
    requireAuth,
    createServiceProxy({
      target: env.userServiceUrl,
      pathRewrite: { '^/api/users': '/users' }
    })
  );

  app.use(
    '/api/products',
    requireAuthForUnsafeMethods,
    createServiceProxy({
      target: env.productServiceUrl,
      pathRewrite: { '^/api/products': '/products' }
    })
  );

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
