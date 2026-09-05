const rateLimit = require('express-rate-limit');
const AppError = require('../errors/AppError');

/**
 * Creates a rate limiter middleware with custom options
 */
const createLimiter = (options) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // Default: 15 minutes
    max: options.max || 100, // Default: 100 requests per window
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res, next) => {
      next(new AppError(options.message || 'Too many requests, please try again later.', 429));
    },
    ...options,
  });
};

// Preset for auth endpoints (e.g., login)
// Max 5 attempts per IP per 15 minutes
const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: 'Too many login attempts from this IP, please try again after 15 minutes.',
});

const aiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  message: 'Too many AI requests from this IP, please try again after 15 minutes.',
});

module.exports = {
  createLimiter,
  authLimiter,
  aiLimiter,
};
