const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportPartner', required: true },
    type: { type: String, enum: ['sedan', 'suv', 'van', 'bus', 'bike'], required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number },
    plateNumber: { type: String, required: true, unique: true },
    capacity: { type: Number, default: 4 },
    pricePerKm: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['available', 'on_trip', 'maintenance', 'offline'], default: 'available' },
    image: { type: String },
}, { timestamps: true });

vehicleSchema.index({ partner: 1, status: 1 });

module.exports = mongoose.model('Vehicle', vehicleSchema);