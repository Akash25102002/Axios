const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const ticketRoutes = require('./routes/ticket.routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security HTTP headers (disable strict CSP to allow fonts and icons)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

// CORS configuration
const allowedOrigin = process.env.CLIENT_URL || '*';
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigin === '*' || origin === allowedOrigin) {
        callback(null, true);
      } else {
        callback(null, true);
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

// Serve static frontend assets from client/dist
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// Fallback all non-API GET routes to React SPA index.html
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Fallback 404 handler for unmatched API requests
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
