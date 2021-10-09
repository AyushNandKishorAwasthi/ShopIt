const AppError = require('../utils/appError');
const handleCastErrorDB = (err) => {
  const message = `The ${err.value} for ${err.path} is invalid`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDb = (err) => {
  // const value = err.errmsg.match(/(["'])(.*?[^\\])\1/)[0];
  const message = `That '${Object.keys(err.keyValue)[0]}' already exists. Please use another one.`;
  return new AppError(message, 400);
};

const handleValidationErrorDb = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalild token. Please login again', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired ! Please log in again', 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    console.log(err.name);
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
  console.log(err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong here...',
    msg: err.message,
  });
};
const sendErrorPro = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Don't leak much details to the user
    console.error('Out of operational error', err);
    return res.status(500).render('error', {
      status: 'error',
      message: 'Oops something went wrong here',
    });
  }
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong here...',
      msg: err.message,
    });
  }
  // Don't leak much details to the user
  console.error('Out of operational error', err);
  return res.status(500).render('error', {
    title: 'Something went wrong here...',
    msg: 'Please try again later...',
  });
};

module.exports = (err, req, res, next) => {
  //   console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    console.log(err.name);
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDb(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDb(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorPro(error, req, res);
  }
};
