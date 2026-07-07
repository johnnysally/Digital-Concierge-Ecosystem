const Partner = require('../../models/partner/Partner');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../../config/env');
const { generateToken } = require('../../utils/helpers');

const register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, phone, businessName, businessType } = req.body;

        const exists = await Partner.findOne({ email });
        if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

        const partner = await Partner.create({ firstName, lastName, email, password, phone, businessName, businessType });

        const token = jwt.sign({ id: partner._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

        res.status(201).json({ success: true, token, user: partner });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const partner = await Partner.findOne({ email }).select('+password');
        if (!partner) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const isMatch = await partner.comparePassword(password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        partner.lastLogin = new Date();
        await partner.save();

        const token = jwt.sign({ id: partner._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

        res.json({ success: true, token, user: partner });
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const partner = await Partner.findById(req.user._id);
        res.json({ success: true, user: partner });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const allowed = ['firstName', 'lastName', 'phone', 'businessName', 'preferences'];
        const updates = {};
        Object.keys(req.body).forEach((key) => {
            if (allowed.includes(key)) updates[key] = req.body[key];
        });

        const partner = await Partner.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
        res.json({ success: true, user: partner });
    } catch (error) {
        next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const partner = await Partner.findById(req.user._id).select('+password');
        const isMatch = await partner.comparePassword(currentPassword);
        if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });

        partner.password = newPassword;
        await partner.save();

        res.json({ success: true, message: 'Password updated' });
    } catch (error) {
        next(error);
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const partner = await Partner.findOne({ email });
        if (!partner) return res.status(404).json({ success: false, message: 'Email not found' });

        const token = generateToken();
        partner.resetPasswordToken = token;
        partner.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await partner.save();

        res.json({ success: true, message: 'Reset link sent to email' });
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        const partner = await Partner.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!partner) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

        partner.password = newPassword;
        partner.resetPasswordToken = undefined;
        partner.resetPasswordExpire = undefined;
        await partner.save();

        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getProfile, updateProfile, changePassword, forgotPassword, resetPassword };