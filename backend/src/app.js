const express = require('express');
const helmet = require('helmet');
const path = require('path');
const corsMiddleware = require('./config/cors');
const env = require('./config/env');

const app = express();

// --------------- Global Middleware ---------------

// Security headers
app.use(helmet());

// CORS
app.use(corsMiddleware);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --------------- Health Check ---------------

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    },
  });
});

// --------------- API Routes ---------------
// Routes will be mounted here in subsequent phases:
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/media', mediaRoutes);
// app.use('/api/ai', aiRoutes);
// app.use('/api/settings', settingsRoutes);

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

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      statusCode: 404,
    },
  });
});

// --------------- Global Error Handler ---------------
// Imported here to keep app.js clean; created in Phase 3
// For now, a basic error handler:

app.use((err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  console.error(`❌ Error: ${message}`, env.NODE_ENV === 'development' ? err.stack : '');

  res.status(statusCode).json({
    success: false,
    error: {
      message: env.NODE_ENV === 'production' && statusCode === 500
        ? 'Something went wrong'
        : message,
      statusCode,
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
});

module.exports = app;
