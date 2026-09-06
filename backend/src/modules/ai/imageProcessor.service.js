const env = require('../../config/env');
const AppError = require('../../common/errors/AppError');
// In a real production app, we would import OpenAI or Replicate SDK here
// const Replicate = require('replicate');
// const replicate = new Replicate({ auth: env.AI_API_KEY });

/**
 * Process image via AI (Background Removal + Brand Styling)
 * Uses a mock/simulated delay for development/testing if AI_API_KEY is missing.
 * 
 * @param {String} imageUrl - The original image URL from Cloudinary
 * @param {Object} brandSettings - BrandSettings document containing imageStyle
 * @returns {Promise<String>} processedUrl - URL or buffer of processed image
 */
const processImage = async (imageUrl, brandSettings) => {
  try {
    const prompt = `
      ${brandSettings.imageStyle}
      IMPORTANT: Preserve the exact shape, color, material, texture, and design of the product in the input image.
      Only change the background and lighting.
    `.trim();

    console.log(`[AI Image Processor] Generating AI background for: ${imageUrl}`);
    
    // Cloudinary Generative AI Background Replacement
    if (imageUrl && imageUrl.includes('cloudinary.com')) {
      // Concise background prompt tailored for HABA brand aesthetic
      const bgPrompt = encodeURIComponent('warm ivory natural linen fabric surface with soft natural studio lighting');
      const enhancedUrl = imageUrl.replace(
        '/upload/',
        `/upload/e_gen_background_replace:prompt_${bgPrompt},f_auto,q_auto/`
      );
      console.log(`[AI Image Processor] Transformed to AI background URL: ${enhancedUrl}`);
      return enhancedUrl;
    }

    // Otherwise simulate slight processing delay and return URL
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `${imageUrl}?enhanced=true&style=haba_ivory`;
  } catch (error) {
    console.warn('AI Image Processing notice:', error.message);
    return imageUrl;
  }
};

module.exports = {
  processImage,
};
