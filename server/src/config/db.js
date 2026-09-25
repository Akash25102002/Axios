const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/supportflow_crm';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] MongoDB Connected to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database] Direct MongoDB connection failed (${error.message}).`);

    // In non-production environments, gracefully fall back to an in-memory instance if available
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('[Database] Starting local in-memory MongoDB server for testing/development...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        const memoryUri = memoryServer.getUri();
        const conn = await mongoose.connect(memoryUri);
        console.log(`[Database] Connected to In-Memory MongoDB: ${memoryUri}`);
        return conn;
      } catch (memError) {
        console.error('[Database] In-memory MongoDB initialization failed:', memError.message);
      }
    }

    console.error('[Database] Could not establish MongoDB connection.');
    throw error;
  }
};

const closeDB = async () => {
  try {
    await mongoose.connection.close();
    if (memoryServer) {
      await memoryServer.stop();
    }
    console.log('[Database] MongoDB connection closed gracefully.');
  } catch (err) {
    console.error('[Database] Error closing MongoDB connection:', err.message);
  }
};

module.exports = { connectDB, closeDB };
