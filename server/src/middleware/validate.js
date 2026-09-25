const ApiError = require('../utils/apiError');

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const VALID_STATUSES = ['Open', 'In Progress', 'Closed'];
const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

/**
 * Validates payload for POST /api/tickets
 */
const validateCreateTicket = (req, res, next) => {
  const { customer_name, customer_email, subject, description, priority } = req.body;

  const errors = [];

  // Check customer name
  if (!customer_name || typeof customer_name !== 'string' || !customer_name.trim()) {
    errors.push('customer_name is required');
  } else if (customer_name.trim().length < 2) {
    errors.push('customer_name must be at least 2 characters');
  } else if (customer_name.trim().length > 100) {
    errors.push('customer_name cannot exceed 100 characters');
  }

  // Check customer email
  if (!customer_email || typeof customer_email !== 'string' || !customer_email.trim()) {
    errors.push('customer_email is required');
  } else if (!EMAIL_REGEX.test(customer_email.trim())) {
    errors.push('customer_email must be a valid email address');
  }

  // Check subject
  if (!subject || typeof subject !== 'string' || !subject.trim()) {
    errors.push('subject is required');
  } else if (subject.trim().length < 3) {
    errors.push('subject must be at least 3 characters');
  } else if (subject.trim().length > 200) {
    errors.push('subject cannot exceed 200 characters');
  }

  // Check description
  if (!description || typeof description !== 'string' || !description.trim()) {
    errors.push('description is required');
  } else if (description.trim().length < 10) {
    errors.push('description must be at least 10 characters');
  }

  // Check priority if provided
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    errors.push(`priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
  }

  if (errors.length > 0) {
    return next(new ApiError(400, errors.join('; ')));
  }

  // Sanitize fields
  req.body.customer_name = customer_name.trim();
  req.body.customer_email = customer_email.trim().toLowerCase();
  req.body.subject = subject.trim();
  req.body.description = description.trim();
  if (priority) {
    req.body.priority = priority.trim();
  }

  next();
};

/**
 * Validates payload for PUT /api/tickets/:ticketId
 */
const validateUpdateTicket = (req, res, next) => {
  const { status, priority, notes } = req.body;

  const errors = [];

  if (status === undefined && priority === undefined && notes === undefined) {
    return next(new ApiError(400, 'At least one field (status, priority, notes) must be provided for update'));
  }

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
    }
  }

  if (priority !== undefined) {
    if (!VALID_PRIORITIES.includes(priority)) {
      errors.push(`priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
    }
  }

  if (notes !== undefined) {
    if (typeof notes !== 'string' || !notes.trim()) {
      errors.push('notes must be a non-empty string when provided');
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(400, errors.join('; ')));
  }

  next();
};

/**
 * Validates :ticketId format
 */
const validateTicketIdParam = (req, res, next) => {
  const { ticketId } = req.params;

  if (!ticketId || typeof ticketId !== 'string' || !ticketId.trim()) {
    return next(new ApiError(400, 'Invalid ticket ID'));
  }

  // Normalize ticketId to uppercase (e.g. tkt-001 -> TKT-001)
  req.params.ticketId = ticketId.trim().toUpperCase();
  next();
};

module.exports = {
  validateCreateTicket,
  validateUpdateTicket,
  validateTicketIdParam
};
