const mongoose = require('mongoose');

const destinationPriceSchema = new mongoose.Schema({
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportPartner', required: true },
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    vehicleType: { type: String, enum: ['sedan', 'suv', 'van', 'bus', 'bike', 'tuk_tuk', 'all'], default: 'all' },
    estimatedDuration: { type: Number, default: null },
    estimatedDistance: { type: Number, default: null },
    departureTimes: [{ type: String }],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

destinationPriceSchema.index({ partner: 1, from: 1, to: 1 });

module.exports = mongoose.model('DestinationPrice', destinationPriceSchema);