const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const accommodationPartnerSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, trim: true },
    avatar: { type: String, default: null },
    businessName: { type: String, required: true, trim: true },
    businessType: { type: String, enum: ['hotel', 'bnb', 'apartment', 'villa', 'hostel'], default: 'hotel' },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    lastLogin: { type: Date },
    preferences: {
        notifications: { email: { type: Boolean, default: true }, sms: { type: Boolean, default: true }, push: { type: Boolean, default: true } },
        portalSettings: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    verificationToken: { type: String },
    verificationExpire: { type: Date },
    otpToken: { type: String },
    otpExpire: { type: Date },
}, { timestamps: true });

accommodationPartnerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

accommodationPartnerSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

accommodationPartnerSchema.methods.toJSON = function () {
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

module.exports = mongoose.model('AccommodationPartner', accommodationPartnerSchema);