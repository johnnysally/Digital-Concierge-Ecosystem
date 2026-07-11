const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const restaurantPartnerSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, trim: true },
    avatar: { type: String, default: null },
    businessName: { type: String, required: true, trim: true },
    cuisine: { type: String, enum: ['african', 'italian', 'chinese', 'indian', 'fast_food', 'seafood', 'other'], default: 'other' },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    isOpen: { type: Boolean, default: false },
    openingHours: { open: { type: String, default: '08:00' }, close: { type: String, default: '22:00' } },
    deliveryEnabled: { type: Boolean, default: true },
    deliveryFee: { type: Number, default: 0 },
    minOrder: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    lastLogin: { type: Date },
    preferences: {
        notifications: { email: { type: Boolean, default: true }, sms: { type: Boolean, default: true }, push: { type: Boolean, default: true } },
    },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    verificationToken: { type: String },
    verificationExpire: { type: Date },
    otpToken: { type: String },
    otpExpire: { type: Date },
}, { timestamps: true });

restaurantPartnerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

restaurantPartnerSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

restaurantPartnerSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.resetPasswordToken;
    delete obj.resetPasswordExpire;
    delete obj.verificationToken;
    delete obj.verificationExpire;
    delete obj.otpToken;
    delete obj.otpExpire;
    delete obj.__v;
    return obj;
};

module.exports = mongoose.model('RestaurantPartner', restaurantPartnerSchema);