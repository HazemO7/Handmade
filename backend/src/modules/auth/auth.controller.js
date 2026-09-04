const authService = require('./auth.service');
const { sendSuccess } = require('../../common/utils/apiResponse');
const asyncHandler = require('../../common/utils/asyncHandler');

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.loginUser(email, password);

  sendSuccess(res, { user, token }, 200);
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  // Since JWT is stateless, logout is handled by the frontend clearing the token.
  // We just return a success message.
  sendSuccess(res, { message: 'Logged out successfully' }, 200);
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  // req.user is set by the auth middleware
  const user = await authService.getCurrentUser(req.user._id);
  sendSuccess(res, { user }, 200);
});

module.exports = {
  login,
  logout,
  getMe,
};
