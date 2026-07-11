const Admin = require('../../models/admin/Admin');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../../config/env');
const { generateToken } = require('../../utils/helpers');

const register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, role, permissions } = req.body;
        const exists = await Admin.findOne({ email });
        if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
        const admin = await Admin.create({ firstName, lastName, email, password, role, permissions });
        const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
        res.status(201).json({ success: true, token, user: admin });
    } catch (error) { next(error); }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email, isActive: true }).select('+password');
        if (!admin) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        admin.lastLogin = new Date();
        await admin.save();
        const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
        res.json({ success: true, token, user: admin });
    } catch (error) { next(error); }
};

const getProfile = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.user._id);
        res.json({ success: true, user: admin });
    } catch (error) { next(error); }
};

const updateProfile = async (req, res, next) => {
    try {
        const allowed = ['firstName', 'lastName', 'avatar'];
        const updates = {};
        Object.keys(req.body).forEach((key) => { if (allowed.includes(key)) updates[key] = req.body[key]; });
        const admin = await Admin.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
        res.json({ success: true, user: admin });
    } catch (error) { next(error); }
};

const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const admin = await Admin.findById(req.user._id).select('+password');
        const isMatch = await admin.comparePassword(currentPassword);
        if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        admin.password = newPassword;
        await admin.save();
        res.json({ success: true, message: 'Password updated' });
    } catch (error) { next(error); }
};

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ success: false, message: 'Email not found' });
        const token = generateToken();
        admin.resetPasswordToken = token;
        admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await admin.save();
        res.json({ success: true, message: 'Reset link sent to email' });
    } catch (error) { next(error); }
};

const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        const admin = await Admin.findOne({ resetPasswordToken: token, resetPasswordExpire: { $gt: Date.now() } });
        if (!admin) return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        admin.password = newPassword;
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpire = undefined;
        await admin.save();
        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) { next(error); }
};

const getAllAdmins = async (req, res, next) => {
    try {
        const admins = await Admin.find().sort({ createdAt: -1 });
        res.json({ success: true, admins });
    } catch (error) { next(error); }
};

const updateAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });
        res.json({ success: true, admin });
    } catch (error) { next(error); }
};

const deleteAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });
        res.json({ success: true, message: 'Admin removed' });
    } catch (error) { next(error); }
};

module.exports = { register, login, getProfile, updateProfile, changePassword, forgotPassword, resetPassword, getAllAdmins, updateAdmin, deleteAdmin };