const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportPartner', required: true },
    type: { type: String, enum: ['sedan', 'suv', 'van', 'bus', 'bike', 'tuk_tuk'], required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number },
    plateNumber: { type: String, required: true, unique: true },
    capacity: { type: Number, default: 4 },
    pricePerKm: { type: Number, required: true },
    pricePerMin: { type: Number, default: 0 },
    baseFare: { type: Number, default: 0 },
    currency: { type: String, default: 'KES' },
    status: { type: String, enum: ['available', 'on_trip', 'maintenance', 'offline'], default: 'available' },
    image: { type: String },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] },
    },
}, { timestamps: true });

vehicleSchema.index({ partner: 1, status: 1 });
vehicleSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Vehicle', vehicleSchema);