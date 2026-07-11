const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'AccommodationPartner', required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    code: { type: String, required: true, uppercase: true, trim: true },
    description: { type: String },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    minAmount: { type: Number, default: 0 },
    maxUses: { type: Number },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
}, { timestamps: true });

promotionSchema.index({ partner: 1, isActive: 1 });
promotionSchema.index({ code: 1, expiryDate: 1 });

module.exports = mongoose.model('Promotion', promotionSchema);