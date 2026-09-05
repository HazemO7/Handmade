const aiService = require('./ai.service');
const { sendSuccess } = require('../../common/utils/apiResponse');
const asyncHandler = require('../../common/utils/asyncHandler');
const AppError = require('../../common/errors/AppError');

/**
 * @desc    Start an AI image processing job for a specific product image
 * @route   POST /api/ai/image-process
 * @access  Private/Admin
 */
const processImage = asyncHandler(async (req, res) => {
  const { productId, imageId, imageUrl, imagePublicId } = req.body;

  if (!productId || !imageId || !imageUrl || !imagePublicId) {
    throw new AppError('Missing required fields (productId, imageId, imageUrl, imagePublicId)', 400);
  }

  const job = await aiService.createImageProcessingJob(productId, imageId, imageUrl, imagePublicId);
  sendSuccess(res, job, 202);
});

/**
 * @desc    Get AI Job status
 * @route   GET /api/ai/jobs/:id
 * @access  Private/Admin
 */
const getJobStatus = asyncHandler(async (req, res) => {
  const job = await aiService.getJobStatus(req.params.id);
  sendSuccess(res, job);
});

/**
 * @desc    Retry a failed AI Job
 * @route   POST /api/ai/jobs/:id/retry
 * @access  Private/Admin
 */
const retryJob = asyncHandler(async (req, res) => {
  const job = await aiService.retryJob(req.params.id);
  sendSuccess(res, job, 202);
});

/**
 * @desc    Start an AI content generation job
 * @route   POST /api/ai/content-generate
 * @access  Private/Admin
 */
const generateContent = asyncHandler(async (req, res) => {
  const { productId, productBasicInfo } = req.body;

  if (!productId || !productBasicInfo) {
    throw new AppError('Missing required fields (productId, productBasicInfo)', 400);
  }

  const job = await aiService.createContentGenerationJob(productId, productBasicInfo);
  sendSuccess(res, job, 202);
});

/**
 * @desc    Apply generated AI content to product
 * @route   POST /api/ai/jobs/:id/apply
 * @access  Private/Admin
 */
const applyContent = asyncHandler(async (req, res) => {
  const result = await aiService.applyContentJob(req.params.id);
  sendSuccess(res, result);
});

module.exports = {
  processImage,
  getJobStatus,
  retryJob,
  generateContent,
  applyContent,
};
