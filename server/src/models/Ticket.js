const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Customer name must be at least 2 characters'],
      maxlength: [100, 'Customer name cannot exceed 100 characters']
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      trim: true,
      lowercase: true,
      index: true,
      match: [
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        'Please provide a valid email address'
      ]
    },
    subject: {
      type: String,
      required: [true, 'Ticket subject is required'],
      trim: true,
      minlength: [3, 'Subject must be at least 3 characters'],
      maxlength: [200, 'Subject cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Ticket description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters']
    },
    status: {
      type: String,
      enum: {
        values: ['Open', 'In Progress', 'Closed'],
        message: 'Status must be Open, In Progress, or Closed'
      },
      default: 'Open',
      index: true
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority must be Low, Medium, or High'
      },
      default: 'Medium',
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Compound index for optimized dashboard listing & filtering sorted by newest first
TicketSchema.index({ status: 1, createdAt: -1 });

// Text index to support full-text search across all relevant fields
TicketSchema.index({
  ticketId: 'text',
  customerName: 'text',
  customerEmail: 'text',
  subject: 'text',
  description: 'text'
});

module.exports = mongoose.model('Ticket', TicketSchema);
