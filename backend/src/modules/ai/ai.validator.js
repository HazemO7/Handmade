const Joi = require('joi');

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
  'string.pattern.base': 'Invalid ID format',
});

const processImageSchema = Joi.object({
  productId: objectId.required(),
  imageId: objectId.required(),
  imageUrl: Joi.string().uri().required(),
  imagePublicId: Joi.string().required()
});

const generateContentSchema = Joi.object({
  productId: objectId.required(),
  productBasicInfo: Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    materials: Joi.array().items(Joi.string()).optional(),
    tags: Joi.array().items(Joi.string()).optional()
  }).unknown(true).required()
});

const jobIdSchema = Joi.object({
  id: objectId.required()
});

module.exports = {
  processImageSchema,
  generateContentSchema,
  jobIdSchema
};
