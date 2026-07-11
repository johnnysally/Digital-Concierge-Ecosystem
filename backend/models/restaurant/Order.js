const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'RestaurantPartner', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    items: [{
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true },
    }],
    status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'], default: 'pending' },
    orderType: { type: String, enum: ['delivery', 'pickup', 'dine_in'], default: 'delivery' },
    deliveryAddress: {
        street: { type: String },
        city: { type: String },
        coordinates: { type: [Number] },
    },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: 'KES' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
    paymentMethod: { type: String },
    notes: { type: String },
    estimatedTime: { type: Number },
    deliveredAt: { type: Date },
}, { timestamps: true });

orderSchema.index({ partner: 1, status: 1 });
orderSchema.index({ customer: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);