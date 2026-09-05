const settingsService = require('./settings.service');
const { sendSuccess } = require('../../common/utils/apiResponse');
const asyncHandler = require('../../common/utils/asyncHandler');

/**
 * @desc    Get store settings
 * @route   GET /api/settings
 * @access  Public
 */
const getSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.getSettings();
  sendSuccess(res, settings);
});

/**
 * @desc    Update store settings
 * @route   PATCH /api/settings
 * @access  Private/Admin
 */
const updateSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.updateSettings(req.body);
  sendSuccess(res, settings);
});

module.exports = {
  getSettings,
  updateSettings,
};
