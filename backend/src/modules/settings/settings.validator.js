const Joi = require('joi');

const updateSettingsSchema = Joi.object({
  brandName: Joi.string().trim().max(100).allow(''),
  logo: Joi.string().uri().allow(''),
  logoPublicId: Joi.string().allow(''),
  primaryColor: Joi.string().regex(/^#([0-9A-Fa-f]{3}){1,2}$/).allow(''),
  secondaryColor: Joi.string().regex(/^#([0-9A-Fa-f]{3}){1,2}$/).allow(''),
  backgroundColor: Joi.string().regex(/^#([0-9A-Fa-f]{3}){1,2}$/).allow(''),
  fontPreference: Joi.string().max(50).allow(''),
  visualStyle: Joi.string().max(200).allow(''),
  imageStyle: Joi.string().max(10000).allow(''),
  whatsappNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).allow('').messages({
    'string.pattern.base': 'WhatsApp number must be in E.164 format (e.g., +20123456789)'
  }),
  defaultCurrency: Joi.string().length(3).allow(''),
  aiInstructions: Joi.string().max(10000).allow('')
});

module.exports = {
  updateSettingsSchema
};
