const AppError = require('./AppError');
const env = require('../../config/env');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] : 'field';
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 409);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, res) => {
  console.error('❌ Error (Dev):', err);
  res.status(err.statusCode).json({
    success: false,
    error: {
      message: err.message,
      statusCode: err.statusCode,
      status: err.status,
      stack: err.stack,
      error: err,
    },
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        statusCode: err.statusCode,
        status: err.status,
      },
    });
  } 
  // Programming or other unknown error: don't leak error details
  else {
    // 1) Log error
    console.error('❌ ERROR (Prod):', err);

    // 2) Send generic message
    res.status(500).json({
      success: false,
      error: {
        message: 'Something went very wrong!',
        statusCode: 500,
        status: 'error',
      },
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.name = err.name;
  error.code = err.code;

  // Handle specific MongoDB/Mongoose errors
  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  
  // Handle specific JWT errors
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else if (env.NODE_ENV === 'production') {
    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;
