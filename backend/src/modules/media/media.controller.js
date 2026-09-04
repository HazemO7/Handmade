const mediaService = require('./media.service');
const { sendSuccess } = require('../../common/utils/apiResponse');
const asyncHandler = require('../../common/utils/asyncHandler');
const AppError = require('../../common/errors/AppError');

/**
 * @desc    Upload an image globally
 * @route   POST /api/media/upload
 * @access  Private/Admin
 */
const upload = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No image file provided', 400);
  }

  // Allow optional folder override, otherwise default to general
  const folder = req.body.folder || 'handmade-store/general';
  
  const result = await mediaService.uploadMedia(req.file.buffer, folder);
  sendSuccess(res, result, 201);
});

/**
 * @desc    Delete an image from Cloudinary by public ID
 * @route   DELETE /api/media
 * @access  Private/Admin
 */
const deleteMedia = asyncHandler(async (req, res) => {
  const { publicId } = req.body; // use req.body since publicId contains slashes and is annoying in URL params
  
  if (!publicId) {
    throw new AppError('Cloudinary publicId is required', 400);
  }

  await mediaService.removeMedia(publicId);
  sendSuccess(res, { message: 'Image deleted successfully' });
});

/**
 * @desc    Upload an image and attach directly to a product
 * @route   POST /api/products/:productId/images
 * @access  Private/Admin
 */
const uploadToProduct = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No image file provided', 400);
  }

  const result = await mediaService.uploadProductImage(req.file.buffer, req.params.productId);
  sendSuccess(res, result.product, 201);
});

/**
 * @desc    Delete an image from a product
 * @route   DELETE /api/products/:productId/images/:imageId
 * @access  Private/Admin
 */
const deleteFromProduct = asyncHandler(async (req, res) => {
  const product = await mediaService.deleteProductImage(req.params.productId, req.params.imageId);
  sendSuccess(res, product);
});

module.exports = {
  upload,
  deleteMedia,
  uploadToProduct,
  deleteFromProduct,
};
