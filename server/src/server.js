const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');
const { connectDB, closeDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();

    server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`  SupportFlow CRM Server Running on port ${PORT}`);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  API Base URL: http://localhost:${PORT}/api/tickets`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown handling
const shutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      console.log('HTTP server closed.');
      await closeDB();
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

startServer();
