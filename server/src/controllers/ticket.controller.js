const TicketService = require('../services/ticket.service');

/**
 * Controller for ticket endpoints
 */
class TicketController {
  /**
   * POST /api/tickets
   * Create a new ticket
   */
  static async createTicket(req, res, next) {
    try {
      const ticket = await TicketService.createTicket(req.body);
      return res.status(201).json({
        ticket_id: ticket.ticket_id,
        customer_name: ticket.customer_name,
        customer_email: ticket.customer_email,
        subject: ticket.subject,
        status: ticket.status,
        priority: ticket.priority,
        created_at: ticket.created_at
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/tickets
   * List tickets with optional status and search filters
   */
  static async getTickets(req, res, next) {
    try {
      const { status, search } = req.query;
      const tickets = await TicketService.getTickets({ status, search });
      return res.status(200).json(tickets);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/tickets/stats
   * Aggregate ticket counts for dashboard KPIs
   */
  static async getTicketStats(req, res, next) {
    try {
      const stats = await TicketService.getTicketStats();
      return res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/tickets/:ticketId
   * Retrieve ticket details with associated notes
   */
  static async getTicketById(req, res, next) {
    try {
      const { ticketId } = req.params;
      const ticket = await TicketService.getTicketById(ticketId);
      return res.status(200).json(ticket);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/tickets/:ticketId
   * Update status, priority, and/or add notes
   */
  static async updateTicket(req, res, next) {
    try {
      const { ticketId } = req.params;
      const result = await TicketService.updateTicket(ticketId, req.body);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TicketController;
