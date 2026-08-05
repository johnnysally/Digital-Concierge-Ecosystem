const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'KES' },
    method: { type: String, enum: ['stripe', 'mpesa', 'wallet', 'airtel', 'bank_transfer', 'cash', 'mpesa_send', 'mpesa_till', 'mpesa_paybill'], required: true },
    type: { type: String, enum: ['payment', 'refund', 'topup', 'payout'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    reference: { type: String },
    transactionId: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

paymentSchema.index({ customer: 1, status: 1 });
paymentSchema.index({ booking: 1 });

module.exports = mongoose.model('Payment', paymentSchema);