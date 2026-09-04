const dotenv = require('dotenv');

// Load .env before anything else
dotenv.config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');

const PORT = env.PORT;

// Connect to MongoDB, then start Express
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
