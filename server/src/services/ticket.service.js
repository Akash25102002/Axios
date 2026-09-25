const Ticket = require('../models/Ticket');
const Note = require('../models/Note');
const Counter = require('../models/Counter');
const ApiError = require('../utils/apiError');

/**
 * Service class encapsulating Ticket business logic
 */
class TicketService {
  /**
   * Generates sequential ticket ID (e.g. TKT-001, TKT-002) atomically
   */
  static async generateTicketId() {
    const counter = await Counter.findByIdAndUpdate(
      'ticketId',
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const paddedNumber = String(counter.seq).padStart(3, '0');
    return `TKT-${paddedNumber}`;
  }

  /**
   * Create a new ticket
   */
  static async createTicket(data) {
    const { customer_name, customer_email, subject, description, priority } = data;

    const ticketId = await this.generateTicketId();

    const ticket = await Ticket.create({
      ticketId,
      customerName: customer_name,
      customerEmail: customer_email,
      subject,
      description,
      priority: priority || 'Medium'
    });

    return {
      ticket_id: ticket.ticketId,
      customer_name: ticket.customerName,
      customer_email: ticket.customerEmail,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      created_at: ticket.createdAt
    };
  }

  /**
   * Get tickets list with optional status and search filtering
   */
  static async getTickets({ status, search }) {
    const query = {};

    // Filter by status if provided and valid
    if (status && ['Open', 'In Progress', 'Closed'].includes(status)) {
      query.status = status;
    }

    // Filter by search string if provided
    if (search && search.trim()) {
      const searchTerm = search.trim();
      const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escapedSearch, 'i');

      query.$or = [
        { ticketId: searchRegex },
        { customerName: searchRegex },
        { customerEmail: searchRegex },
        { subject: searchRegex },
        { description: searchRegex }
      ];
    }

    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return tickets.map((t) => ({
      ticket_id: t.ticketId,
      customer_name: t.customerName,
      customer_email: t.customerEmail,
      subject: t.subject,
      status: t.status,
      priority: t.priority,
      created_at: t.createdAt
    }));
  }

  /**
   * Aggregates stats for dashboard KPI cards
   */
  static async getTicketStats() {
    const [total, open, inProgress, closed] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: 'Open' }),
      Ticket.countDocuments({ status: 'In Progress' }),
      Ticket.countDocuments({ status: 'Closed' })
    ]);

    return {
      total,
      open,
      in_progress: inProgress,
      closed
    };
  }

  /**
   * Get ticket details by ticketId along with its notes
   */
  static async getTicketById(ticketId) {
    const ticket = await Ticket.findOne({ ticketId }).lean();

    if (!ticket) {
      throw ApiError.notFound(`Ticket with ID ${ticketId} not found`);
    }

    const notes = await Note.find({ ticketId })
      .sort({ createdAt: 1 })
      .lean();

    return {
      ticket_id: ticket.ticketId,
      customer_name: ticket.customerName,
      customer_email: ticket.customerEmail,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      created_at: ticket.createdAt,
      updated_at: ticket.updatedAt,
      notes: notes.map((n) => ({
        id: n._id.toString(),
        note_text: n.noteText,
        created_at: n.createdAt
      }))
    };
  }

  /**
   * Update ticket status, priority, and/or append a new note
   */
  static async updateTicket(ticketId, { status, priority, notes }) {
    const ticket = await Ticket.findOne({ ticketId });

    if (!ticket) {
      throw ApiError.notFound(`Ticket with ID ${ticketId} not found`);
    }

    let isModified = false;

    if (status && ticket.status !== status) {
      ticket.status = status;
      isModified = true;
    }

    if (priority && ticket.priority !== priority) {
      ticket.priority = priority;
      isModified = true;
    }

    let addedNote = null;
    if (notes && typeof notes === 'string' && notes.trim()) {
      addedNote = await Note.create({
        ticketId,
        noteText: notes.trim()
      });
      isModified = true;
    }

    if (isModified) {
      ticket.updatedAt = new Date();
      await ticket.save();
    }

    return {
      success: true,
      updated_at: ticket.updatedAt,
      ticket: {
        ticket_id: ticket.ticketId,
        status: ticket.status,
        priority: ticket.priority
      },
      note: addedNote
        ? {
            id: addedNote._id.toString(),
            note_text: addedNote.noteText,
            created_at: addedNote.createdAt
          }
        : null
    };
  }
}

module.exports = TicketService;
