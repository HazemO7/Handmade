const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess } = require('../../common/utils/apiResponse');
const AppError = require('../../common/errors/AppError');
const chatService = require('./chat.service');

/**
 * Handle incoming chat message
 * POST /api/chat
 */
const sendMessage = asyncHandler(async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new AppError('Message is required and must be a non-empty string', 400);
  }

  if (message.length > 500) {
    throw new AppError('Message is too long (maximum 500 characters)', 400);
  }

  const result = await chatService.handleChatMessage({
    message: message.trim(),
    history: Array.isArray(history) ? history : [],
  });

  return sendSuccess(res, result);
});

module.exports = {
  sendMessage,
};
