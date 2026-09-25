const app = require('../server/src/app');
const { connectDB } = require('../server/src/config/db');

// Ensure database connection in serverless environment
let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error('Serverless DB connection error:', err.message);
    }
  }
  return app(req, res);
};
