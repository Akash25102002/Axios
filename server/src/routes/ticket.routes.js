const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/ticket.controller');
const {
  validateCreateTicket,
  validateUpdateTicket,
  validateTicketIdParam
} = require('../middleware/validate');

// Dashboard statistics
router.get('/stats', TicketController.getTicketStats);

// Ticket collection routes
router.route('/')
  .post(validateCreateTicket, TicketController.createTicket)
  .get(TicketController.getTickets);

// Single ticket routes
router.route('/:ticketId')
  .get(validateTicketIdParam, TicketController.getTicketById)
  .put(validateTicketIdParam, validateUpdateTicket, TicketController.updateTicket);

module.exports = router;
