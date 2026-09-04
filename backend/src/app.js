const express = require('express');
const helmet = require('helmet');
const path = require('path');
const corsMiddleware = require('./config/cors');
const env = require('./config/env');
const AppError = require('./common/errors/AppError');
const globalErrorHandler = require('./common/errors/errorHandler');

const app = express();

// --------------- Global Middleware ---------------

// Security headers
app.use(helmet());

// CORS
app.use(corsMiddleware);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const routes = require('./routes/index');

// --------------- API Routes ---------------
app.use('/api', routes);

// --------------- Production: Serve Frontend ---------------

if (env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
  app.use(express.static(frontendPath));

  // SPA fallback — send index.html for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  });
}

// --------------- 404 Handler ---------------

app.use((req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
});

// --------------- Global Error Handler ---------------

app.use(globalErrorHandler);

module.exports = app;
