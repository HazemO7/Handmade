const AppError = require('../errors/AppError');

/**
 * Restrict routes to admin users only.
 * Must be used AFTER auth middleware (protect).
 */
const restrictToAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new AppError('Access denied. Admin only.', 403));
  }
  next();
};

module.exports = {
  restrictToAdmin,
};
