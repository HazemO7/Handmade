/**
 * Wraps an async route handler to automatically catch any rejected promises 
 * and pass them to the Express error handling middleware via `next(err)`.
 * 
 * @param {Function} fn - The asynchronous Express middleware or route handler function.
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
