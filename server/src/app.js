const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const ticketRoutes = require('./routes/ticket.routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
const allowedOrigin = process.env.CLIENT_URL || '*';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigin === '*' || origin === allowedOrigin) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all in dev, can restrict in production
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Express JSON body parser with size limit to prevent payload attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount Ticket API routes
app.use('/api/tickets', ticketRoutes);

// Fallback 404 handler
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
