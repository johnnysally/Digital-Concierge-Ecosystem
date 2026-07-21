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
    dispatchStatus: { type: String, enum: ['available', 'dispatched', 'en_route', 'arrived', 'in_service', 'completed'], default: 'available' },
    image: { type: String },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] },
    },
    currentTrip: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', default: null },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', default: null },
    maintenance: {
        lastService: { type: Date },
        nextService: { type: Date },
        condition: { type: String, enum: ['excellent', 'good', 'fair', 'needs_service', 'grounded'], default: 'good' },
        serviceHistory: [{
            date: { type: Date, default: Date.now },
            type: { type: String, enum: ['routine', 'repair', 'inspection', 'emergency', 'parts_replacement'], required: true },
            description: { type: String },
            cost: { type: Number, default: 0 },
            garage: { type: String },
            notes: { type: String },
        }],
    },
    insurance: {
        provider: { type: String },
        policyNumber: { type: String },
        expiryDate: { type: Date },
    },
    registration: {
        expiryDate: { type: Date },
    },
}, { timestamps: true });

vehicleSchema.index({ partner: 1, status: 1 });
vehicleSchema.index({ location: '2dsphere' });
vehicleSchema.index({ dispatchStatus: 1 });

module.exports = mongoose.model('Vehicle', vehicleSchema);