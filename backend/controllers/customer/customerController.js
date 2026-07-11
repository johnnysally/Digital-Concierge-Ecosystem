const Customer = require('../../models/customer/Customer');
const Booking = require('../../models/customer/Booking');
const Payment = require('../../models/customer/Payment');
const Wallet = require('../../models/customer/Wallet');
const ChatMessage = require('../../models/customer/ChatMessage');
const Review = require('../../models/customer/Review');
const Notification = require('../../models/customer/Notification');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../../config/env');
const { generateToken, generateOTP } = require('../../utils/helpers');
const { getDefaultCurrency } = require('../../utils/currencyConverter');
const { customer: customerEmails } = require('../../services/emailService');
const logger = require('../../utils/logger');

const register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body;
        const exists = await Customer.findOne({ email });
        if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
        const defaultCurrency = await getDefaultCurrency();
        const verificationToken = generateToken();
        const customer = await Customer.create({
            firstName, lastName, email, password, phone,
            currency: defaultCurrency,
            verificationToken,
            verificationExpire: Date.now() + 24 * 60 * 60 * 1000,
        });
        const token = jwt.sign({ id: customer._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
        customerEmails.sendWelcome(customer, `${process.env.CUSTOMER_URL}/verify/${verificationToken}`).catch(e => logger.error(`Welcome email failed: ${e.message}`));
        res.status(201).json({ success: true, token, user: customer });
    } catch (error) { next(error); }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const customer = await Customer.findOne({ email }).select('+password');
        if (!customer) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        const isMatch = await customer.comparePassword(password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        customer.lastLogin = new Date();
        await customer.save();
        const token = jwt.sign({ id: customer._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
        res.json({ success: true, token, user: customer });
    } catch (error) { next(error); }
};

const getProfile = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.user._id);
        res.json({ success: true, user: customer });
    } catch (error) { next(error); }
};

const updateProfile = async (req, res, next) => {
    try {
        const allowed = ['firstName', 'lastName', 'phone', 'language', 'currency', 'preferences'];
        const updates = {};
        Object.keys(req.body).forEach((key) => { if (allowed.includes(key)) updates[key] = req.body[key]; });
        const customer = await Customer.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
        customerEmails.sendAccountChanged(customer, 'profile').catch(e => logger.error(`Account change email failed: ${e.message}`));
        res.json({ success: true, user: customer });
    } catch (error) { next(error); }
};

const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const customer = await Customer.findById(req.user._id).select('+password');
        const isMatch = await customer.comparePassword(currentPassword);
        if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        customer.password = newPassword;
        await customer.save();
        customerEmails.sendAccountChanged(customer, 'password').catch(e => logger.error(`Password change email failed: ${e.message}`));
        res.json({ success: true, message: 'Password updated' });
    } catch (error) { next(error); }
};

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const customer = await Customer.findOne({ email });
        if (!customer) return res.status(404).json({ success: false, message: 'Email not found' });
        const token = generateToken();
        customer.resetPasswordToken = token;
        customer.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await customer.save();
        customerEmails.sendPasswordReset(customer, `${process.env.CUSTOMER_URL}/reset-password/${token}`).catch(e => logger.error(`Password reset email failed: ${e.message}`));
        res.json({ success: true, message: 'Reset link sent to email' });
    } catch (error) { next(error); }
};

const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        const customer = await Customer.findOne({ resetPasswordToken: token, resetPasswordExpire: { $gt: Date.now() } });
        if (!customer) return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        customer.password = newPassword;
        customer.resetPasswordToken = undefined;
        customer.resetPasswordExpire = undefined;
        await customer.save();
        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) { next(error); }
};

const sendOTP = async (req, res, next) => {
    try {
        const otp = generateOTP();
        const customer = await Customer.findByIdAndUpdate(req.user._id, {
            otpToken: otp,
            otpExpire: Date.now() + 5 * 60 * 1000,
        }, { new: true });
        customerEmails.sendOTP(customer, otp).catch(e => logger.error(`OTP email failed: ${e.message}`));
        res.json({ success: true, message: 'OTP sent to your email' });
    } catch (error) { next(error); }
};

const verifyOTP = async (req, res, next) => {
    try {
        const { otp } = req.body;
        const customer = await Customer.findOne({ _id: req.user._id, otpToken: otp, otpExpire: { $gt: Date.now() } });
        if (!customer) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        customer.otpToken = undefined;
        customer.otpExpire = undefined;
        customer.twoFactorEnabled = true;
        await customer.save();
        res.json({ success: true, message: '2FA enabled successfully' });
    } catch (error) { next(error); }
};

const addAddress = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.user._id);
        customer.savedAddresses.push(req.body);
        await customer.save();
        res.json({ success: true, addresses: customer.savedAddresses });
    } catch (error) { next(error); }
};

const deleteAddress = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.user._id);
        customer.savedAddresses.pull({ _id: req.params.id });
        await customer.save();
        res.json({ success: true, addresses: customer.savedAddresses });
    } catch (error) { next(error); }
};

const deleteAccount = async (req, res, next) => {
    try {
        const customerId = req.user._id.toString();
        const deleted = await Customer.findByIdAndDelete(req.user._id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Account not found' });
        await Booking.deleteMany({ customer: customerId });
        await Payment.deleteMany({ customer: customerId });
        await Wallet.deleteOne({ customer: customerId });
        await ChatMessage.deleteMany({ customer: customerId });
        await Review.deleteMany({ customer: customerId });
        await Notification.deleteMany({ customer: customerId });
        res.json({ success: true, message: 'Account permanently deleted' });
    } catch (error) { next(error); }
};

module.exports = { register, login, getProfile, updateProfile, changePassword, forgotPassword, resetPassword, sendOTP, verifyOTP, addAddress, deleteAddress, deleteAccount };