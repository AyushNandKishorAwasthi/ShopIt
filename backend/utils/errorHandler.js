class ErrorHandler extends Error {
  constructor(message, errorCode) {
    super(message);
    this.statusCode = errorCode || 500;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = ErrorHandler;
