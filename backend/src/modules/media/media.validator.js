const Joi = require('joi');

const deleteMediaSchema = Joi.object({
  publicId: Joi.string().required(),
});

module.exports = {
  deleteMediaSchema,
};
