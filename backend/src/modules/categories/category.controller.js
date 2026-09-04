const categoryService = require('./category.service');
const { sendSuccess } = require('../../common/utils/apiResponse');
const asyncHandler = require('../../common/utils/asyncHandler');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getAll = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  sendSuccess(res, categories);
});

/**
 * @desc    Get category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
const getById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  sendSuccess(res, category);
});

/**
 * @desc    Create a category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
const create = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  sendSuccess(res, category, 201);
});

/**
 * @desc    Update a category
 * @route   PATCH /api/categories/:id
 * @access  Private/Admin
 */
const update = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  sendSuccess(res, category);
});

/**
 * @desc    Delete a category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
const remove = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  sendSuccess(res, { message: 'Category deleted successfully' });
});

/**
 * @desc    Reorder categories
 * @route   PATCH /api/categories/reorder
 * @access  Private/Admin
 */
const reorder = asyncHandler(async (req, res) => {
  await categoryService.reorderCategories(req.body.orderedIds);
  sendSuccess(res, { message: 'Categories reordered successfully' });
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  reorder,
};
