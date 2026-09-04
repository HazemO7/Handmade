const { uploadImage, deleteImage } = require('../../config/cloudinary');
const Product = require('../products/product.model');
const Category = require('../categories/category.model');
const AppError = require('../../common/errors/AppError');

/**
 * Upload an image (generic)
 */
const uploadMedia = async (fileBuffer, folder = 'handmade-store/general') => {
  return await uploadImage(fileBuffer, folder);
};

/**
 * Upload an image and immediately attach it to a product
 */
const uploadProductImage = async (fileBuffer, productId) => {
  const product = await Product.findById(productId);
  if (!product) throw new AppError('Product not found', 404);

  const folder = `handmade-store/products/${productId}`;
  const uploaded = await uploadImage(fileBuffer, folder);

  const newImage = {
    originalUrl: uploaded.url,
    publicId: uploaded.publicId,
    isPrimary: product.images.length === 0, // make primary if first image
  };

  product.images.push(newImage);
  await product.save();

  return { product, uploaded };
};

/**
 * Remove an image from Cloudinary and the product document
 */
const deleteProductImage = async (productId, imageId) => {
  const product = await Product.findById(productId);
  if (!product) throw new AppError('Product not found', 404);

  const imageIndex = product.images.findIndex(img => img._id.toString() === imageId);
  if (imageIndex === -1) throw new AppError('Image not found in product', 404);

  const image = product.images[imageIndex];

  // Delete from cloudinary
  await deleteImage(image.publicId);

  // Remove from array
  product.images.splice(imageIndex, 1);
  
  // Re-elect primary if we deleted the primary image and others exist
  if (image.isPrimary && product.images.length > 0) {
    product.images[0].isPrimary = true;
  }

  await product.save();
  return product;
};

/**
 * Delete a media file from Cloudinary directly (Generic)
 */
const removeMedia = async (publicId) => {
  // Try deleting from Cloudinary
  return await deleteImage(publicId);
};

module.exports = {
  uploadMedia,
  uploadProductImage,
  deleteProductImage,
  removeMedia,
};
