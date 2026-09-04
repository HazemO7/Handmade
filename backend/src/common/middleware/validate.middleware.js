const AppError = require('../errors/AppError');

/**
 * Middleware factory to validate request data against a Joi schema.
 * 
 * @param {Object} schema - Joi schema to validate against
 * @param {string} source - Request property to validate (default: 'body')
 * @returns {Function} Express middleware function
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false, // Return all errors
      stripUnknown: true, // Remove unknown keys
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join('. ');
      return next(new AppError(`Validation Error: ${errorMessages}`, 400));
    }

    // Assign the validated and sanitized value back to the request
    req[source] = value;
    next();
  };
};

module.exports = validate;
