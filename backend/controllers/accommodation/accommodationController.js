const AccommodationPartner = require('../../models/accommodation/AccommodationPartner');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../../config/env');
const { generateToken, generateOTP } = require('../../utils/helpers');
const { partner: partnerEmails } = require('../../services/emailService');
const logger = require('../../utils/logger');
const Admin = require('../../models/admin/Admin');

const register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, phone, businessName, businessType } = req.body;
        const exists = await AccommodationPartner.findOne({ email });
        if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
        const verificationToken = generateToken();
        const partner = await AccommodationPartner.create({
            firstName, lastName, email, password, phone, businessName, businessType,
            verificationToken, verificationExpire: Date.now() + 24 * 60 * 60 * 1000,
        });
        const token = jwt.sign({ id: partner._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
        partnerEmails.sendRegistrationReceived(partner).catch(e => logger.error(`Registration email failed: ${e.message}`));
        
        const admins = await Admin.find({ isActive: true, 'permissions.partners': true });
        for (const admin of admins) {
            partnerEmails.sendNewPartnerNotification(admin, partner).catch(e => logger.error(`Admin notification failed: ${e.message}`));
        }
        
        res.status(201).json({ success: true, token, user: partner, message: 'Registration submitted. Awaiting admin approval.' });
    } catch (error) { next(error); }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const partner = await AccommodationPartner.findOne({ email }).select('+password');
        if (!partner) return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        const isMatch = await partner.comparePassword(password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        if (!partner.isVerified) return res.status(403).json({ success: false, message: 'Your account is pending admin approval. You will receive an email once approved.', code: 'PENDING_APPROVAL' });
        if (!partner.isActive) return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support.', code: 'ACCOUNT_SUSPENDED' });
        partner.lastLogin = new Date();
        await partner.save();
        const token = jwt.sign({ id: partner._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
        res.json({ success: true, token, user: partner });
    } catch (error) { next(error); }
};

const getProfile = async (req, res, next) => {
    try { const partner = await AccommodationPartner.findById(req.user._id); res.json({ success: true, user: partner }); }
    catch (error) { next(error); }
};

const updateProfile = async (req, res, next) => {
    try {
        const allowed = ['firstName', 'lastName', 'phone', 'businessName', 'preferences'];
        const updates = {};
        Object.keys(req.body).forEach((key) => { if (allowed.includes(key)) updates[key] = req.body[key]; });
        const partner = await AccommodationPartner.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
        res.json({ success: true, user: partner });
    } catch (error) { next(error); }
};

const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const partner = await AccommodationPartner.findById(req.user._id).select('+password');
        const isMatch = await partner.comparePassword(currentPassword);
        if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        partner.password = newPassword;
        await partner.save();
        res.json({ success: true, message: 'Password updated' });
    } catch (error) { next(error); }
};

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const partner = await AccommodationPartner.findOne({ email });
        if (!partner) return res.status(404).json({ success: false, message: 'Email not found' });
        const token = generateToken();
        partner.resetPasswordToken = token;
        partner.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await partner.save();
        partnerEmails.sendPasswordReset(partner, `${process.env.PARTNER_URL}/reset-password/${token}`).catch(e => logger.error(`Password reset email failed: ${e.message}`));
        res.json({ success: true, message: 'Reset link sent to email' });
    } catch (error) { next(error); }
};

const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        const partner = await AccommodationPartner.findOne({ resetPasswordToken: token, resetPasswordExpire: { $gt: Date.now() } });
        if (!partner) return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        partner.password = newPassword;
        partner.resetPasswordToken = undefined;
        partner.resetPasswordExpire = undefined;
        await partner.save();
        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) { next(error); }
};

const sendOTP = async (req, res, next) => {
    try {
        const otp = generateOTP();
        await AccommodationPartner.findByIdAndUpdate(req.user._id, { otpToken: otp, otpExpire: Date.now() + 5 * 60 * 1000 });
        partnerEmails.sendOTP(req.user, otp).catch(e => logger.error(`OTP email failed: ${e.message}`));
        res.json({ success: true, message: 'OTP sent to your email' });
    } catch (error) { next(error); }
};

const verifyOTP = async (req, res, next) => {
    try {
        const { otp } = req.body;
        const partner = await AccommodationPartner.findOne({ _id: req.user._id, otpToken: otp, otpExpire: { $gt: Date.now() } });
        if (!partner) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        partner.otpToken = undefined;
        partner.otpExpire = undefined;
        await partner.save();
        res.json({ success: true, message: '2FA verified' });
    } catch (error) { next(error); }
};

module.exports = { register, login, getProfile, updateProfile, changePassword, forgotPassword, resetPassword, sendOTP, verifyOTP };