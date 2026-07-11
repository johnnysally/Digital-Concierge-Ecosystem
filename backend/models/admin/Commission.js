const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
    partnerType: { type: String, enum: ['accommodation', 'restaurant', 'transport'], required: true },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    flatFee: { type: Number, default: 0 },
    minPayout: { type: Number, default: 50 },
    payoutSchedule: { type: String, enum: ['daily', 'weekly', 'biweekly', 'monthly'], default: 'weekly' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Commission', commissionSchema);