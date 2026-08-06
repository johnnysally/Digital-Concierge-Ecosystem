const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportPartner', required: true },
    type: { type: String, enum: ['sedan', 'suv', 'bike', 'tuk_tuk', 'van', 'bus'], required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number },
    plateNumber: { type: String, required: true, unique: true },
    capacity: { type: Number, default: 4 },
    pricePerKm: { type: Number, required: true },
    pricePerMin: { type: Number, default: 0 },
    baseFare: { type: Number, default: 0 },
    currency: { type: String, default: 'KES' },
    availability: { type: String, enum: ['online', 'offline'], default: 'online' },
    status: { type: String, enum: ['idle', 'dispatched', 'on_trip', 'maintenance'], default: 'idle' },
    dispatchStatus: { type: String, enum: ['available', 'dispatched', 'en_route', 'arrived', 'in_service', 'completed'], default: 'available' },
    image: { type: String },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] },
    },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', default: null },

    isLongDistance: { type: Boolean, default: false },
    totalSeats: { type: Number, default: null },
    availableSeats: { type: Number, default: null },
    activeRides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }],

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
    insurance: { provider: { type: String }, policyNumber: { type: String }, expiryDate: { type: Date } },
    registration: { expiryDate: { type: Date } },
}, { timestamps: true });

vehicleSchema.index({ partner: 1, availability: 1, status: 1, isLongDistance: 1 });
vehicleSchema.index({ location: '2dsphere' });
vehicleSchema.index({ dispatchStatus: 1 });

vehicleSchema.pre('save', function (next) {
    if (['van', 'bus'].includes(this.type)) {
        this.isLongDistance = true;
        if (!this.totalSeats) this.totalSeats = this.type === 'van' ? 14 : 30;
        if (this.availableSeats === null || this.isNew) this.availableSeats = this.totalSeats;
    } else {
        this.isLongDistance = false;
        this.totalSeats = null;
        this.availableSeats = null;
    }
    next();
});

module.exports = mongoose.model('Vehicle', vehicleSchema);