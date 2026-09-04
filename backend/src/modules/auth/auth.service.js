const jwt = require('jsonwebtoken');
const User = require('../users/user.model');
const AppError = require('../../common/errors/AppError');
const env = require('../../config/env');

/**
 * Generate JWT for a user
 * @param {string} userId - User's MongoDB ID
 * @param {string} role - User's role
 * @returns {string} Signed JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * Validate credentials, generate token, and return user data
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} { user, token }
 */
const loginUser = async (email, password) => {
  // 1. Check if user exists & select password field (it's select: false in schema)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // 2. Check if password is correct
  const isMatch = await user.comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // 3. Generate token
  const token = generateToken(user._id, user.role);

  // 4. Return user (without password) and token
  // Convert mongoose doc to plain object and remove password
  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

/**
 * Get current user by ID (used for /me route)
 * @param {string} userId 
 * @returns {Object} User document
 */
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

module.exports = {
  generateToken,
  loginUser,
  getCurrentUser,
};
