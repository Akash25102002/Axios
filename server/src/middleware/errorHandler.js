const ApiError = require('../utils/apiError');

/**
 * Global Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert non-ApiError exceptions to ApiError
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';

    // Handle Mongoose CastError (e.g. invalid ObjectId or cast types)
    if (error.name === 'CastError') {
      statusCode = 400;
      message = `Invalid value for field: ${error.path}`;
    }

    // Handle Mongoose Validation Error
    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(error.errors)
        .map((val) => val.message)
        .join('; ');
    }

    // Handle MongoDB duplicate key error (E11000)
    if (error.code === 11000) {
      statusCode = 409;
      const field = Object.keys(error.keyValue || {})[0] || 'field';
      message = `Duplicate value entered for ${field}. Please use another value.`;
    }

    // Handle JSON syntax error from bad client body
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
      statusCode = 400;
      message = 'Malformed JSON in request body';
    }

    error = new ApiError(statusCode, message, false, err.stack);
  }

  const response = {
    success: false,
    error: error.message || 'An unexpected error occurred',
  };

  // Only expose detailed stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  // Log critical 500 errors
  if (error.statusCode >= 500) {
    console.error(`[Server Error ${error.statusCode}]:`, error.message, error.stack);
  }

  res.status(error.statusCode || 500).json(response);
};

module.exports = errorHandler;
