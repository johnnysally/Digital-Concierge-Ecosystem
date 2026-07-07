const Customer = require('../../models/customer/Customer');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../../config/env');
const { generateToken } = require('../../utils/helpers');

const register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body;

        const exists = await Customer.findOne({ email });
        if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

        const customer = await Customer.create({ firstName, lastName, email, password, phone });

        const token = jwt.sign({ id: customer._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

        res.status(201).json({ success: true, token, user: customer });
    } catch (error) {
        next(error);
    }
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
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.user._id);
        res.json({ success: true, user: customer });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const allowed = ['firstName', 'lastName', 'phone', 'language', 'currency', 'preferences'];
        const updates = {};
        Object.keys(req.body).forEach((key) => {
            if (allowed.includes(key)) updates[key] = req.body[key];
        });

        const customer = await Customer.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
        res.json({ success: true, user: customer });
    } catch (error) {
        next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const customer = await Customer.findById(req.user._id).select('+password');
        const isMatch = await customer.comparePassword(currentPassword);
        if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });

        customer.password = newPassword;
        await customer.save();

        res.json({ success: true, message: 'Password updated' });
    } catch (error) {
        next(error);
    }
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

        res.json({ success: true, message: 'Reset link sent to email' });
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        const customer = await Customer.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!customer) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

        customer.password = newPassword;
        customer.resetPasswordToken = undefined;
        customer.resetPasswordExpire = undefined;
        await customer.save();

        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        next(error);
    }
};

const addAddress = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.user._id);
        customer.savedAddresses.push(req.body);
        await customer.save();
        res.json({ success: true, addresses: customer.savedAddresses });
    } catch (error) {
        next(error);
    }
};

const deleteAddress = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.user._id);
        customer.savedAddresses.pull({ _id: req.params.id });
        await customer.save();
        res.json({ success: true, addresses: customer.savedAddresses });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getProfile, updateProfile, changePassword, forgotPassword, resetPassword, addAddress, deleteAddress };