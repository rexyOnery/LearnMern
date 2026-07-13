import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import {
  buildHealthResponse,
  createCorsOptions,
  errorHandler,
  notFoundHandler
} from '@mern-microservices/shared';
import { env } from './config/env.js';
import { userRouter } from './routes/user.routes.js';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors(createCorsOptions({ origins: env.corsOrigins })));
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

  app.get('/health', (_req, res) => {
    res.json(buildHealthResponse('user-service'));
  });

  app.use('/users', userRouter);
  app.use('/', userRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
