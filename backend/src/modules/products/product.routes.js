const express = require('express');
const productController = require('./product.controller');
const validate = require('../../common/middleware/validate.middleware');
const { 
  createProductSchema, 
  updateProductSchema, 
  queryProductSchema 
} = require('./product.validator');
const { protect } = require('../../common/middleware/auth.middleware');
const { restrictToAdmin } = require('../../common/middleware/admin.middleware');

const router = express.Router();

const adminMiddleware = [protect, restrictToAdmin];

// Public routes
router.get('/', validate(queryProductSchema, 'query'), productController.getProducts);

// Admin / Dashboard routes
router.get('/admin/all', adminMiddleware, validate(queryProductSchema, 'query'), productController.getAdminProducts);
router.get('/admin/stats', adminMiddleware, productController.getStats);
router.get('/admin/:id', adminMiddleware, productController.getProductById);

// Admin Write routes
router.post('/', adminMiddleware, validate(createProductSchema), productController.createProduct);
router.patch('/:id', adminMiddleware, validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', adminMiddleware, productController.deleteProduct);

// Status transition routes (Admin)
router.post('/:id/publish', adminMiddleware, productController.publishProduct);
router.post('/:id/unpublish', adminMiddleware, productController.unpublishProduct);
router.post('/:id/archive', adminMiddleware, productController.archiveProduct);

// Public slug route MUST be at the bottom to avoid catching /admin etc.
router.get('/:slug', productController.getProductBySlug);

module.exports = router;
