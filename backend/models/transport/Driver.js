const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportPartner', required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    licenseExpiry: { type: Date },
    status: { type: String, enum: ['available', 'on_trip', 'offline', 'suspended'], default: 'offline' },
    rating: { type: Number, default: 0 },
    totalTrips: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    currentLocation: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] },
    },
}, { timestamps: true });

driverSchema.index({ partner: 1, status: 1 });

module.exports = mongoose.model('Driver', driverSchema);