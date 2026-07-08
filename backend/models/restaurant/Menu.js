const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'RestaurantPartner', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String, enum: ['appetizer', 'main', 'dessert', 'beverage', 'side'], required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    image: { type: String },
    available: { type: Boolean, default: true },
    tags: [{ type: String }],
}, { timestamps: true });

menuSchema.index({ partner: 1, available: 1 });

module.exports = mongoose.model('Menu', menuSchema);