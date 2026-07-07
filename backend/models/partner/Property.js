const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    type: { type: String, enum: ['hotel', 'bnb', 'apartment', 'villa', 'hostel'], default: 'hotel' },
    address: {
        street: { type: String },
        city: { type: String, required: true },
        state: { type: String },
        country: { type: String, required: true, default: 'Kenya' },
        pincode: { type: String },
        coordinates: { lat: { type: Number }, lng: { type: Number } },
    },
    amenities: [{ type: String }],
    photos: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    checkInTime: { type: String, default: '14:00' },
    checkOutTime: { type: String, default: '11:00' },
}, { timestamps: true });

propertySchema.index({ partner: 1 });
propertySchema.index({ published: 1, 'address.city': 1 });

module.exports = mongoose.model('Property', propertySchema);