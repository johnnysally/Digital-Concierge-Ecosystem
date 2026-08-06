const mongoose = require('mongoose');

const destinationPriceSchema = new mongoose.Schema({
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportPartner', required: true },
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    vehicleType: { type: String, enum: ['sedan', 'suv', 'bike', 'tuk_tuk', 'van', 'bus', 'all'], default: 'all' },
    estimatedDuration: { type: Number, default: null },

    isLongDistance: { type: Boolean, default: false },
    estimatedDistance: { type: Number, default: null },
    departureTimes: [{ type: String }],

    isActive: { type: Boolean, default: true },
}, { timestamps: true });

destinationPriceSchema.index({ partner: 1, from: 1, to: 1, isLongDistance: 1 });

destinationPriceSchema.pre('save', function (next) {
    this.isLongDistance = ['van', 'bus'].includes(this.vehicleType);
    next();
});

module.exports = mongoose.model('DestinationPrice', destinationPriceSchema);