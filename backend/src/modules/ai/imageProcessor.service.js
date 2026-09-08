const env = require('../../config/env');
const AppError = require('../../common/errors/AppError');

/**
 * Process image via AI (Background Removal + Brand Styling)
 *
 * Strategy:
 * 1. Use Cloudinary's background removal to cleanly isolate the product
 * 2. Place on a clean, brand-colored ivory background
 * 3. Apply auto-quality and auto-format for performance
 *
 * This approach preserves the product 100% faithfully — no GenAI
 * distortion of beads, colors, or textures.
 *
 * @param {String} imageUrl - The original image URL from Cloudinary
 * @param {Object} brandSettings - BrandSettings document containing imageStyle
 * @returns {Promise<String>} processedUrl - URL of processed image
 */
const processImage = async (imageUrl, brandSettings) => {
  try {
    console.log(`[AI Image Processor] Processing image: ${imageUrl}`);

    // Cloudinary URL-based transformations (no SDK calls needed)
    if (imageUrl && imageUrl.includes('cloudinary.com')) {
      // Approach: Remove background → place on HABA ivory background
      // e_background_removal — AI-powered clean background removal
      // b_rgb:F7F1E8 — HABA Ivory as the new solid background
      // c_pad,ar_4:5,g_center — pad to 4:5 aspect ratio (e-commerce standard), centered
      // f_auto,q_auto — optimal format and quality
      const transformations = [
        'e_background_removal',    // Clean AI background removal
        'b_rgb:F7F1E8',            // HABA Ivory background
        'c_pad,ar_4:5,g_center',   // E-commerce 4:5 aspect ratio, product centered
        'f_auto,q_auto'            // Optimal delivery
      ].join(',');

      const enhancedUrl = imageUrl.replace(
        '/upload/',
        `/upload/${transformations}/`
      );
      console.log(`[AI Image Processor] Enhanced URL: ${enhancedUrl}`);
      return enhancedUrl;
    }

    // Non-Cloudinary images: return as-is with a query flag
    await new Promise(resolve => setTimeout(resolve, 500));
    return `${imageUrl}?enhanced=true&style=haba_ivory`;
  } catch (error) {
    console.warn('AI Image Processing notice:', error.message);
    // Always fallback to original — never break the upload flow
    return imageUrl;
  }
};

module.exports = {
  processImage,
};
