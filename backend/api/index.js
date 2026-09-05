const mongoose = require('mongoose');
const app = require('../src/app');
const env = require('../src/config/env');

let isConnected = false;

// We need to inject the connection logic before the routes,
// but since `app` already has routes mounted, the easiest way
// in a Serverless environment is to lazily connect on the first request 
// if not already connected, or override the handler.

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      console.log('Connecting to MongoDB in Serverless environment...');
      await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      isConnected = true;
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      return res.status(500).json({ success: false, message: 'Database connection failed' });
    }
  }
  
  // Pass the request to the Express app
  return app(req, res);
};
