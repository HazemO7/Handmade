const cloudinary = require('cloudinary').v2;
const env = require('./env');

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME || 'mock_cloud_name',
  api_key: env.CLOUDINARY_API_KEY || 'mock_api_key',
  api_secret: env.CLOUDINARY_API_SECRET || 'mock_api_secret',
});

/**
 * Upload an image buffer to Cloudinary using a stream.
 * If credentials are not configured, falls back to Data URL for seamless development/demo.
 * @param {Buffer} fileBuffer - The image buffer from multer
 * @param {String} folder - Cloudinary folder path
 * @returns {Promise<Object>} { url, publicId }
 */
const uploadImage = (fileBuffer, folder = 'handmade-store/general') => {
  // If no real Cloudinary API key is provided, gracefully use a base64 Data URL
  const isMock = !env.CLOUDINARY_API_KEY || 
                 env.CLOUDINARY_API_KEY === 'mock_api_key' || 
                 !env.CLOUDINARY_CLOUD_NAME || 
                 env.CLOUDINARY_CLOUD_NAME === 'mock_cloud_name';

  if (isMock) {
    console.log('[Cloudinary Mock] Uploading image as mock Data URL');
    const base64Image = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
    return Promise.resolve({
      url: base64Image,
      publicId: `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    });
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );
    
    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete an image from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @returns {Promise<Object>} result
 */
const deleteImage = (publicId) => {
  if (!publicId || publicId.startsWith('mock_')) {
    return Promise.resolve({ result: 'ok' });
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = {
  cloudinary,
  uploadImage,
  deleteImage,
};
