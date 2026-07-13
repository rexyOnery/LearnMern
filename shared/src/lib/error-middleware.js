import { ApiError } from './api-error.js';
import { logger } from './logger.js';

export const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, _req, res, _next) => {
  const isKnownError = err instanceof ApiError;
  const statusCode = isKnownError ? err.statusCode : 500;
  const message = isKnownError ? err.message : 'Unexpected server error';

  if (statusCode >= 500) {
    logger.error(err.stack || err.message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: err.details
  });
};
