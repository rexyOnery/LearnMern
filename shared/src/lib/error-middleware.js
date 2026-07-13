import { ApiError } from './api-error.js';
import { logger } from './logger.js';

export const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err instanceof ApiError ? err.statusCode : 500;
  let message = err instanceof ApiError ? err.message : 'Unexpected server error';
  let details = err.details;

  if (err.name === 'MongoServerError' && err.code === 11000) {
    statusCode = 409;
    message = 'A record with that value already exists';
    details = err.keyValue;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Database validation failed';
    details = Object.values(err.errors || {}).map((error) => error.message);
  }

  if (
    ['MongoNetworkError', 'MongoTimeoutError', 'MongooseServerSelectionError'].includes(
      err.name
    )
  ) {
    statusCode = 503;
    message = 'Database unavailable. Check the MongoDB connection string and network access.';
  }

  if (statusCode >= 500) {
    logger.error(err.stack || err.message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details
  });
};
