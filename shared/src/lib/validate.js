import { ApiError } from './api-error.js';

export const validate =
  (schema, source = 'body') =>
  (req, _res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      next(
        new ApiError(
          400,
          'Validation failed',
          result.error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message
          }))
        )
      );
      return;
    }

    req[source] = result.data;
    next();
  };
