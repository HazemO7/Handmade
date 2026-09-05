const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Category name must be at least 2 characters',
    'string.max': 'Category name cannot exceed 100 characters',
    'any.required': 'Category name is required',
  }),
  description: Joi.string().allow('', null).optional(),
  sortOrder: Joi.number().integer().min(0).optional(),
  isActive: Joi.boolean().optional(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().allow('', null).optional(),
  sortOrder: Joi.number().integer().min(0).optional(),
  isActive: Joi.boolean().optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

const reorderCategorySchema = Joi.object({
  orderedIds: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'At least one ID must be provided',
    'any.required': 'orderedIds array is required',
  }),
});

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
  'string.pattern.base': 'Invalid ID format',
});

const idSchema = Joi.object({
  id: objectId.required(),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  reorderCategorySchema,
  idSchema,
};
