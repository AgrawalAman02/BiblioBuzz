/**
 * Middleware for handling 404 errors when a route is not found
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global error handler middleware
 * Sends standardized error responses with appropriate status codes
 */
export const errorHandler = (err, req, res, next) => {
  // Set status code (use 500 as fallback if status code wasn't set)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Send response with error message and stack trace (in development only)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};