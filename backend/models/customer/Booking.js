const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, default: 1 },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded', 'partial'], default: 'pending' },
    specialRequests: { type: String },
    cancellationReason: { type: String },
    cancelledAt: { type: Date },
}, { timestamps: true });

bookingSchema.index({ customer: 1, status: 1 });
bookingSchema.index({ property: 1, checkIn: 1 });

module.exports = mongoose.model('Booking', bookingSchema);