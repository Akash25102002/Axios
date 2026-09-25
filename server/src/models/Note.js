const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: [true, 'Ticket ID is required for a note'],
      trim: true,
      index: true
    },
    noteText: {
      type: String,
      required: [true, 'Note text cannot be empty'],
      trim: true,
      minlength: [1, 'Note text must contain at least 1 character']
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: 1
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('Note', NoteSchema);
