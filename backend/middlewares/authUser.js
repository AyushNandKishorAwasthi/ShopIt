const catchAsync = require('./catchAsync');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');
const User = require('../models/userModel');
exports.authenticUser = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return next(new ErrorHandler('Please login again', 401));
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(payload.id);
  console.log(req.user.name);
  next();
});

exports.authRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new ErrorHandler("You don't have permission to perform this action", 403));
    next();
  };
};
