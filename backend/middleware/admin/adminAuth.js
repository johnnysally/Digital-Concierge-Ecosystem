const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/env');
const Admin = require('../../models/admin/Admin');

const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ success: false, message: 'Access denied' });
        const decoded = jwt.verify(token, JWT_SECRET);
        const admin = await Admin.findById(decoded.id);
        if (!admin || !admin.isActive) return res.status(401).json({ success: false, message: 'Admin not found or inactive' });
        req.user = admin;
        next();
    } catch (error) { next(error); }
};

module.exports = adminAuth;