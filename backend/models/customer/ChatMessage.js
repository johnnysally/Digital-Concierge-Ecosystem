const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    sender: { type: String, enum: ['customer', 'ai'], required: true },
    message: { type: String, required: true },
    suggestions: [{ type: String }],
    context: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

chatMessageSchema.index({ customer: 1, createdAt: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);