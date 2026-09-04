const express = require('express');
const { sendSuccess } = require('../common/utils/apiResponse');
const env = require('../config/env');

const router = express.Router();

// --------------- Health Check ---------------
router.get('/health', (req, res) => {
  sendSuccess(res, {
    status: 'ok',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// --------------- Module Routes ---------------
const authRoutes = require('../modules/auth/auth.routes');
router.use('/auth', authRoutes);
// router.use('/products', productRoutes);
// router.use('/categories', categoryRoutes);
// router.use('/media', mediaRoutes);
// --------------- Test Route (Development only) ---------------
if (env.NODE_ENV === 'development') {
  const asyncHandler = require('../common/utils/asyncHandler');
  const AppError = require('../common/errors/AppError');
  router.get('/test-error', asyncHandler(async (req, res) => {
    throw new AppError('This is an intentional test error', 403);
  }));
}

module.exports = router;
