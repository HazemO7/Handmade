/**
 * Utility functions for consistent API responses.
 */

/**
 * Send a successful response.
 * @param {Object} res - Express response object
 * @param {any} data - Data to send in the response
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};

/**
 * Send an error response (can be used manually, though errorHandler usually handles this).
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 */
const sendError = (res, message, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
    },
  });
};

/**
 * Send a paginated successful response.
 * @param {Object} res - Express response object
 * @param {Array} data - Array of records
 * @param {Object} pagination - Pagination metadata { page, limit, totalPages, totalResults }
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const sendPaginated = (res, data, pagination, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data: {
      products: data,
      pagination,
    },
    pagination,
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated,
};
