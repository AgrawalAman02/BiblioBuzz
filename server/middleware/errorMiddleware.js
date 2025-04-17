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
  // Log the error for debugging
  console.error('Error:', err);

  // If response status is still 200, set it to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Ensure CORS headers are set even in error responses
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.headers.origin) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};