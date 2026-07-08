const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    roomNumber: { type: String, required: true },
    type: { type: String, required: true, enum: ['single', 'double', 'suite', 'family', 'deluxe', 'penthouse'] },
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    capacity: { type: Number, default: 1 },
    status: { type: String, enum: ['available', 'occupied', 'maintenance', 'cleaning'], default: 'available' },
    description: { type: String },
    amenities: [{ type: String }],
    photos: [{ type: String }],
    floor: { type: Number },
}, { timestamps: true });

roomSchema.index({ property: 1, status: 1 });

module.exports = mongoose.model('Room', roomSchema);