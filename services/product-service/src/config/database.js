import mongoose from 'mongoose';
import { logger } from '@mern-microservices/shared';
import { env } from './env.js';

export const connectDatabase = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongodbUri);
  logger.info('Product Service connected to MongoDB');
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
};
