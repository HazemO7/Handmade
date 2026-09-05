const express = require('express');
const productController = require('./product.controller');
const validate = require('../../common/middleware/validate.middleware');
const { 
  createProductSchema, 
  updateProductSchema, 
  queryProductSchema,
  idSchema,
  slugSchema,
  deleteImageSchema
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
router.get('/admin/:id', adminMiddleware, validate(idSchema, 'params'), productController.getProductById);

const { uploadSingle } = require('../../common/middleware/upload.middleware');
const mediaController = require('../media/media.controller');

// Admin Write routes
router.post('/', adminMiddleware, validate(createProductSchema), productController.createProduct);
router.patch('/:id', adminMiddleware, validate(idSchema, 'params'), validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', adminMiddleware, validate(idSchema, 'params'), productController.deleteProduct);

// Product Image Management routes (Admin)
// For uploadToProduct, productId is in params
const productIdSchema = require('joi').object({ productId: idSchema.extract('id') });
router.post('/:productId/images', adminMiddleware, validate(productIdSchema, 'params'), uploadSingle, mediaController.uploadToProduct);
router.delete('/:productId/images/:imageId', adminMiddleware, validate(deleteImageSchema, 'params'), mediaController.deleteFromProduct);

// Status transition routes (Admin)
router.post('/:id/publish', adminMiddleware, validate(idSchema, 'params'), productController.publishProduct);
router.post('/:id/unpublish', adminMiddleware, validate(idSchema, 'params'), productController.unpublishProduct);
router.post('/:id/archive', adminMiddleware, validate(idSchema, 'params'), productController.archiveProduct);

// Public slug route MUST be at the bottom to avoid catching /admin etc.
router.get('/:slug', validate(slugSchema, 'params'), productController.getProductBySlug);

module.exports = router;
