const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportPartner', required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    customerPhone: { type: String },
    pickup: {
        address: { type: String, required: true },
        note: { type: String, default: '' },
        coordinates: { type: [Number], default: [0, 0] },
    },
    dropoff: {
        address: { type: String, required: true },
        note: { type: String, default: '' },
        coordinates: { type: [Number], default: [0, 0] },
    },
    status: { type: String, enum: ['requested', 'accepted', 'arrived', 'in_progress', 'completed', 'cancelled'], default: 'requested' },
    rideType: { type: String, enum: ['immediate', 'scheduled'], default: 'immediate' },
    scheduledTime: { type: Date },
    startedAt: { type: Date },
    completedAt: { type: Date },
    distance: { type: Number },
    duration: { type: Number },

    isLongDistance: { type: Boolean, default: false },
    seats: { type: Number, default: null },
    seatNumbers: [{ type: Number }],

    fare: {
        base: { type: Number, default: 0 },
        distance: { type: Number, default: 0 },
        time: { type: Number, default: 0 },
        total: { type: Number, required: true },
        currency: { type: String, default: 'KES' },
    },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
    rating: { type: Number, min: 1, max: 5 },
    feedback: { type: String },
}, { timestamps: true });

rideSchema.index({ partner: 1, status: 1, isLongDistance: 1 });
rideSchema.index({ customer: 1, createdAt: -1 });
rideSchema.index({ vehicle: 1, status: 1 });

module.exports = mongoose.model('Ride', rideSchema);