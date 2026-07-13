import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import {
  buildHealthResponse,
  errorHandler,
  notFoundHandler
} from '@mern-microservices/shared';
import { env } from './config/env.js';
import { authRouter } from './routes/auth.routes.js';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigins, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

  app.get('/health', (_req, res) => {
    res.json(buildHealthResponse('auth-service'));
  });

  app.use('/auth', authRouter);
  app.use('/', authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
