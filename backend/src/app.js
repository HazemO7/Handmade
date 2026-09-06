const express = require('express');
const helmet = require('helmet');
const corsMiddleware = require('./config/cors');
const env = require('./config/env');
const AppError = require('./common/errors/AppError');
const globalErrorHandler = require('./common/errors/errorHandler');

const app = express();

// --------------- Global Middleware ---------------

// Security headers
app.use(helmet());

// Data sanitization against NoSQL query injection
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());

// Prevent parameter pollution
const hpp = require('hpp');
app.use(hpp());

// CORS
app.use(corsMiddleware);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const { createLimiter } = require('./common/middleware/rateLimiter.middleware');

// Apply global rate limiter for /api
app.use('/api', createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes.'
}));

const routes = require('./routes/index');

// --------------- API Routes ---------------
app.use('/api', routes);

// --------------- Health Check ---------------

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Handmade Store API is running', environment: env.NODE_ENV });
});

// --------------- 404 Handler ---------------

app.use((req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
});

// --------------- Global Error Handler ---------------

app.use(globalErrorHandler);

module.exports = app;
