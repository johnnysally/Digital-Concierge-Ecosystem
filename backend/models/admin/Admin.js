const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['super_admin', 'admin', 'support'], default: 'admin' },
    avatar: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    permissions: {
        partners: { type: Boolean, default: true },
        customers: { type: Boolean, default: true },
        transactions: { type: Boolean, default: true },
        disputes: { type: Boolean, default: true },
        reports: { type: Boolean, default: true },
        settings: { type: Boolean, default: false },
    },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
}, { timestamps: true });

adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

adminSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.resetPasswordToken;
    delete obj.resetPasswordExpire;
    delete obj.__v;
    return obj;
};

module.exports = mongoose.model('Admin', adminSchema);