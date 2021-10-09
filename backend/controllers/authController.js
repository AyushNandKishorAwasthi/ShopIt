const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsync = require('../middlewares/catchAsync');
const cloudinary = require('cloudinary');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

const sendToken = (user, res, statusCode) => {
  const token = user.JwtToken();
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRY * 24 * 60 * 60 * 1000),
    httpOnly: true,
  });

  res.status(statusCode).json({
    success: 'true',
    token,
    user,
  });
};
exports.registerUser = catchAsync(async (req, res, next) => {
  if(req.body.avatar==='undefined') 
  return next(new ErrorHandler('Please upload your image',404))
  const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: 'avatars',
    width: 150,
    crop: 'scale',
  });
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });
  sendToken(user, res, 201);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new ErrorHandler('Please enter email and password'), 400);
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new ErrorHandler('Incorrect email or password', 401));
  sendToken(user, res, 200);
});

exports.logout = (req, res, next) => {
  res.cookie('jwt', null, {
    expiresIn: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: 'true',
  });
};

exports.getCurrentUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new ErrorHandler('User not found', 400));
  res.status(200).json({
    success: 'true',
    user,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  let result;
  const newData = {
    name: req.body?.name,
    email: req.body?.email,
  };
  if (req.body.avatar) {
    const user = await User.findById(req.user.id);
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: 'avatars',
      width: 150,
      crop: 'scale',
    });
    newData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }
  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: 'true',
    message: 'Data updated successfully',
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const newData = {
    name: req.body?.name,
    email: req.body?.email,
    role: req.body?.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: 'true',
    message: 'Data updated successfully',
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new ErrorHandler('User does not exists', 400));
  const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);

  res.status(200).json({
    success: 'true',
    message: 'User deleted',
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  const usersCount = await User.countDocuments();
  res.status(200).json({
    success: 'true',
    usersCount,
    users,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler('User does not exists', 400));
  res.status(200).json({
    success: 'true',
    user,
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new ErrorHandler('There is no user with this email address', 404));
  const resetToken = user.randomHashToken();
  await user.save({ validateBeforeSave: false });
  /* const url = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetToken}`; */
  const url = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;
  const message = `This is your reset password link: \n\n ${url} \n\n The link is active for 10 minutes only.\n\n If you haven't requested this, then please ignore.`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'ShopIT password recovery email',
      message,
    });
    res.status(200).json({
      success: 'true',
      message: 'Password reset token sent to your mail.',
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler('There was error sending mail, please try again', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const token = req.params.token;
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword) return next(new ErrorHandler('Please enter password and confirm password'), 400);
  if (password !== confirmPassword) return next(new ErrorHandler('Passwords does not match', 400));
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ resetPasswordToken: hash, resetPasswordExpire: { $gt: Date.now() } });
  if (!user) return next(new ErrorHandler('Password reset time expired, please request again', 403));
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  res.status(200).json({
    success: 'true',
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  const { newPassword, confirmPassword, oldPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmPassword)
    return next(new ErrorHandler('Password fields must not be empty !', 400));
  if (newPassword !== confirmPassword) return next(new ErrorHandler('Passwords does not confirms', 400));
  if (!user || !(await user.correctPassword(oldPassword, user.password)))
    return next(new ErrorHandler('Please enter your correct current password', 401));
  user.password = newPassword;
  await user.save();
  sendToken(user, res, 200);
});
