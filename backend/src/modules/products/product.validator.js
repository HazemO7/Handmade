const Joi = require('joi');

// Helper to validate MongoDB ObjectIds
const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
  'string.pattern.base': 'Invalid ID format',
});

const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  price: Joi.number().greater(0).required(),
  category: objectId.required(),
  stock: Joi.number().integer().min(0).required(),
  
  // Optional fields with defaults or validations
  shortDescription: Joi.string().allow('', null).optional(),
  description: Joi.string().allow('', null).optional(),
  currency: Joi.string().optional(),
  materials: Joi.array().items(Joi.string()).optional(),
  colors: Joi.array().items(Joi.string()).optional(),
  dimensions: Joi.string().allow('', null).optional(),
  features: Joi.array().items(Joi.string()).optional(),
  highlights: Joi.array().items(Joi.string()).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid('DRAFT', 'PROCESSING', 'READY_FOR_REVIEW', 'PUBLISHED', 'ARCHIVED').optional(),
  seo: Joi.object({
    title: Joi.string().allow('', null).optional(),
    description: Joi.string().allow('', null).optional(),
  }).optional(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(200).optional(),
  price: Joi.number().greater(0).optional(),
  category: objectId.optional(),
  stock: Joi.number().integer().min(0).optional(),
  
  shortDescription: Joi.string().allow('', null).optional(),
  description: Joi.string().allow('', null).optional(),
  currency: Joi.string().optional(),
  materials: Joi.array().items(Joi.string()).optional(),
  colors: Joi.array().items(Joi.string()).optional(),
  dimensions: Joi.string().allow('', null).optional(),
  features: Joi.array().items(Joi.string()).optional(),
  highlights: Joi.array().items(Joi.string()).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid('DRAFT', 'PROCESSING', 'READY_FOR_REVIEW', 'PUBLISHED', 'ARCHIVED').optional(),
  seo: Joi.object({
    title: Joi.string().allow('', null).optional(),
    description: Joi.string().allow('', null).optional(),
  }).optional(),
}).min(1);

const queryProductSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  status: Joi.string().valid('DRAFT', 'PROCESSING', 'READY_FOR_REVIEW', 'PUBLISHED', 'ARCHIVED').optional(),
  category: Joi.string().optional(),
  search: Joi.string().optional(),
  sort: Joi.string().optional(),
});

const idSchema = Joi.object({
  id: objectId.required(),
});

const slugSchema = Joi.object({
  slug: Joi.string().required(),
});

const deleteImageSchema = Joi.object({
  productId: objectId.required(),
  imageId: objectId.required(),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  queryProductSchema,
  idSchema,
  slugSchema,
  deleteImageSchema,
};
