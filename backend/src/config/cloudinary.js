const cloudinary = require('cloudinary').v2;
const env = require('./env');

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME || 'mock_cloud_name',
  api_key: env.CLOUDINARY_API_KEY || 'mock_api_key',
  api_secret: env.CLOUDINARY_API_SECRET || 'mock_api_secret',
});

/**
 * Upload an image buffer to Cloudinary using a stream
 * @param {Buffer} fileBuffer - The image buffer from multer
 * @param {String} folder - Cloudinary folder path
 * @returns {Promise<Object>} { url, publicId }
 */
const uploadImage = (fileBuffer, folder = 'handmade-store/general') => {
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
