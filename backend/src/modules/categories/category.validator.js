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

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  reorderCategorySchema,
};
