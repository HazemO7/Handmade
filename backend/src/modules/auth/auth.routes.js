const express = require('express');
const authController = require('./auth.controller');
const validate = require('../../common/middleware/validate.middleware');
const { loginSchema } = require('./auth.validator');
const { protect } = require('../../common/middleware/auth.middleware');
const { authLimiter } = require('../../common/middleware/rateLimiter.middleware');

const router = express.Router();

// Public routes
router.post('/login', authLimiter, validate(loginSchema), authController.login);

// Protected routes (require valid JWT)
router.use(protect);
router.post('/logout', authController.logout);
router.get('/me', authController.getMe);

module.exports = router;
