const cors = require('cors');
const env = require('./env');

/**
 * CORS configuration.
 * In development: allow frontend origin + common localhost ports.
 * In production: allow configured FRONTEND_URL + Vercel preview URLs.
 */
const allowedOrigins = env.NODE_ENV === 'production'
  ? [env.FRONTEND_URL].filter(Boolean)
  : [env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    
    // Check against allowed origins list
    if (allowedOrigins.includes(origin)) return callback(null, true);
    
    // Also allow any *.vercel.app subdomain in production (preview deployments)
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = cors(corsOptions);
