const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    resolution: { type: String },
    resolvedAt: { type: Date },
}, { timestamps: true });

supportTicketSchema.index({ customer: 1, status: 1 });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);