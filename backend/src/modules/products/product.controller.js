const productService = require('./product.service');
const { sendSuccess, sendPaginated } = require('../../common/utils/apiResponse');
const asyncHandler = require('../../common/utils/asyncHandler');

/**
 * @desc    Get all products (Public returns PUBLISHED only; Admin returns all)
 * @route   GET /api/products
 * @access  Public (filtered) / Admin (unfiltered)
 */
const getProducts = asyncHandler(async (req, res) => {
  const options = { ...req.query };
  // Force status to PUBLISHED for public API
  options.status = 'PUBLISHED';

  const result = await productService.getProducts(options);
  sendPaginated(res, result.products, result.pagination);
});

/**
 * @desc    Get all products (Admin returns all)
 * @route   GET /api/products/admin
 * @access  Private/Admin
 */
const getAdminProducts = asyncHandler(async (req, res) => {
  const result = await productService.getProducts(req.query);
  sendPaginated(res, result.products, result.pagination);
});

/**
 * @desc    Get single product by slug
 * @route   GET /api/products/:slug
 * @access  Public
 */
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);
  sendSuccess(res, product);
});

/**
 * @desc    Get single product by ID (Admin)
 * @route   GET /api/products/id/:id
 * @access  Private/Admin
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  sendSuccess(res, product);
});

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  sendSuccess(res, product, 201);
});

/**
 * @desc    Update a product
 * @route   PATCH /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  sendSuccess(res, product);
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  sendSuccess(res, { message: 'Product deleted successfully' });
});

/**
 * @desc    Publish a product
 * @route   POST /api/products/:id/publish
 * @access  Private/Admin
 */
const publishProduct = asyncHandler(async (req, res) => {
  const product = await productService.publishProduct(req.params.id);
  sendSuccess(res, product);
});

/**
 * @desc    Unpublish a product (Revert to DRAFT)
 * @route   POST /api/products/:id/unpublish
 * @access  Private/Admin
 */
const unpublishProduct = asyncHandler(async (req, res) => {
  const product = await productService.unpublishProduct(req.params.id);
  sendSuccess(res, product);
});

/**
 * @desc    Archive a product
 * @route   POST /api/products/:id/archive
 * @access  Private/Admin
 */
const archiveProduct = asyncHandler(async (req, res) => {
  const product = await productService.archiveProduct(req.params.id);
  sendSuccess(res, product);
});

/**
 * @desc    Get product statistics for admin dashboard
 * @route   GET /api/products/admin/stats
 * @access  Private/Admin
 */
const getStats = asyncHandler(async (req, res) => {
  const stats = await productService.getProductStats();
  sendSuccess(res, stats);
});

module.exports = {
  getProducts,
  getAdminProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  publishProduct,
  unpublishProduct,
  archiveProduct,
  getStats,
};
