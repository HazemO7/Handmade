const express = require('express');
const { createLimiter } = require('../../common/middleware/rateLimiter.middleware');
const chatController = require('./chat.controller');

const router = express.Router();

// Customer chat rate limiter: up to 30 messages per 15 minutes per IP
const chatLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'تم إرسال عدد كبير من الرسائل، يرجى الانتظار قليلاً والمحاولة لاحقاً.',
});

router.post('/', chatLimiter, chatController.sendMessage);

module.exports = router;
