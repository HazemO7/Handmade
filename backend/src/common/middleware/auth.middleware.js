const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('../errors/AppError');
const env = require('../../config/env');
const User = require('../../modules/users/user.model');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Protect routes - verify JWT and set req.user
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1) Getting token and check if it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, env.JWT_SECRET);
  } catch (err) {
    return next(new AppError('Invalid token or token expired. Please log in again!', 401));
  }

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist.', 401)
    );
  }

  // 4) Check if user changed password after the token was issued (Optional but good practice)
  // If we had a passwordChangedAt field on the schema, we would check it here.

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

module.exports = {
  protect,
};
