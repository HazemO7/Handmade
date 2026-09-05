const express = require('express');
const categoryController = require('./category.controller');
const validate = require('../../common/middleware/validate.middleware');
const { 
  createCategorySchema, 
  updateCategorySchema, 
  reorderCategorySchema,
  idSchema
} = require('./category.validator');
const { protect } = require('../../common/middleware/auth.middleware');
const { restrictToAdmin } = require('../../common/middleware/admin.middleware');

const router = express.Router();

// Public routes
router.get('/', categoryController.getAll);
router.get('/:id', validate(idSchema, 'params'), categoryController.getById);

// Protected routes (Admin only)
router.use(protect);
router.use(restrictToAdmin);

router.post('/', validate(createCategorySchema), categoryController.create);
router.patch('/reorder', validate(reorderCategorySchema), categoryController.reorder);
router.patch('/:id', validate(idSchema, 'params'), validate(updateCategorySchema), categoryController.update);
router.delete('/:id', validate(idSchema, 'params'), categoryController.remove);

module.exports = router;
