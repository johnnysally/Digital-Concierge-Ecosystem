const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'RestaurantPartner', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String, enum: ['appetizer', 'main', 'dessert', 'beverage', 'side', 'combo'], required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'KES' },
    image: { type: String },
    available: { type: Boolean, default: true },
    isPopular: { type: Boolean, default: false },
    tags: [{ type: String }],
    prepTime: { type: Number, default: 15 },
}, { timestamps: true });

menuItemSchema.index({ partner: 1, available: 1, category: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);