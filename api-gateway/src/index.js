import { logger } from '@mern-microservices/shared';
import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

const server = app.listen(env.port, () => {
  logger.info(`API Gateway listening on port ${env.port}`);
});

const shutdown = (signal) => {
  logger.info(`Received ${signal}. Closing API Gateway.`);
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
