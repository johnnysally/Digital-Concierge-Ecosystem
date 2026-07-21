const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/env');
const Customer = require('../../models/customer/Customer');

const customerAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const customer = await Customer.findById(decoded.id);

        if (!customer) return res.status(401).json({ success: false, message: 'Account not found. Please register.' });
        if (!customer.isActive) return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support for assistance.', code: 'ACCOUNT_SUSPENDED' });

        req.user = customer;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') return res.status(401).json({ success: false, message: 'Invalid session. Please log in again.' });
        if (error.name === 'TokenExpiredError') return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
        next(error);
    }
};

module.exports = customerAuth;