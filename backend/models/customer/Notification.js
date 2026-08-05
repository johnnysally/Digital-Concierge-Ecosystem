const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: String, required: true },
    userType: { type: String, enum: ['customer', 'partner', 'admin'], default: 'customer' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['booking', 'payment', 'promotion', 'system', 'chat', 'review', 'transport', 'food'], required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);