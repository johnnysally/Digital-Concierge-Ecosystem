const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'RestaurantPartner', required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    role: { type: String, required: true, enum: ['manager', 'chef', 'waiter', 'delivery', 'cashier', 'other'] },
    active: { type: Boolean, default: true },
    inviteToken: { type: String },
    inviteExpire: { type: Date },
    joinedAt: { type: Date },
}, { timestamps: true });

staffSchema.index({ partner: 1, active: 1 });

module.exports = mongoose.model('RestaurantStaff', staffSchema);