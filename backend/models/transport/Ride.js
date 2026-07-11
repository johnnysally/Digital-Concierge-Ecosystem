const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportPartner', required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    pickup: {
        address: { type: String, required: true },
        coordinates: { type: [Number], required: true },
    },
    dropoff: {
        address: { type: String, required: true },
        coordinates: { type: [Number], required: true },
    },
    status: { type: String, enum: ['requested', 'accepted', 'arrived', 'in_progress', 'completed', 'cancelled'], default: 'requested' },
    rideType: { type: String, enum: ['immediate', 'scheduled'], default: 'immediate' },
    scheduledTime: { type: Date },
    startedAt: { type: Date },
    completedAt: { type: Date },
    distance: { type: Number },
    duration: { type: Number },
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

rideSchema.index({ partner: 1, status: 1 });
rideSchema.index({ customer: 1, createdAt: -1 });

module.exports = mongoose.model('Ride', rideSchema);