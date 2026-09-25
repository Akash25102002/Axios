const ApiError = require('../utils/apiError');

const notFound = (req, res, next) => {
  next(new ApiError(404, `Endpoint not found - ${req.originalUrl}`));
};

module.exports = notFound;
