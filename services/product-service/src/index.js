import { logger } from '@mern-microservices/shared';
import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';

await connectDatabase();

const app = createApp();
const server = app.listen(env.port, () => {
  logger.info(`Product Service listening on port ${env.port}`);
});

const shutdown = async (signal) => {
  logger.info(`Received ${signal}. Closing Product Service.`);
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
