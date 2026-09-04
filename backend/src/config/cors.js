const cors = require('cors');
const env = require('./env');

/**
 * CORS configuration.
 * In development: allow frontend origin.
 * In production: restrict to configured origin only.
 */
const corsOptions = {
  origin: env.NODE_ENV === 'production'
    ? env.FRONTEND_URL
    : [env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = cors(corsOptions);
