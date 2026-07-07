const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    method: { type: String, enum: ['stripe', 'mpesa', 'wallet', 'airtel'], required: true },
    type: { type: String, enum: ['payment', 'refund', 'topup'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    reference: { type: String },
    transactionId: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

paymentSchema.index({ customer: 1, status: 1 });
paymentSchema.index({ booking: 1 });

module.exports = mongoose.model('Payment', paymentSchema);