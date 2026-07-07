const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner', required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    guestName: { type: String, required: true },
    guestEmail: { type: String },
    guestPhone: { type: String },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, default: 1 },
    status: { type: String, enum: ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'], default: 'pending' },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'partial', 'refunded'], default: 'pending' },
    notes: { type: String },
}, { timestamps: true });

reservationSchema.index({ partner: 1, status: 1 });
reservationSchema.index({ property: 1, checkIn: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);