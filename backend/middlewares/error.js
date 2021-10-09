const errorHandler = require('../utils/errorHandler');
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'DEVELOPMENT')
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });

  if (process.env.NODE_ENV === 'PRODUCTION') {
    console.log(err.name);
    let error = { ...err };
    error.message = err.message;
    if (err.name === 'CastError') {
      error = new errorHandler(`Resource not found. Invalid ${err.path}`, 400);
    }
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map((v) => v.message);
      error = new errorHandler(message, 400);
    }
    if (err.code === 11000) {
      error = new errorHandler(`${Object.keys(err.keyValue)} already exists`, 400);
    }
    if (err.name === 'JsonWebTokenError') {
      error = new errorHandler('Invalid Web Token, please login again');
    }

    if (err.name === 'TokenExpiredError') {
      error = new errorHandler('Token expired, please login again');
    }
    res.status(error.statusCode).json({
      status: 'fail',
      message: error.message || 'Internal Server Error',
    });
  }
};
