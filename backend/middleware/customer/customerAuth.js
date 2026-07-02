const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/env');
const Customer = require('../../models/customer/Customer');

const customerAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ success: false, message: 'Access denied' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const customer = await Customer.findById(decoded.id);
        if (!customer) return res.status(401).json({ success: false, message: 'User not found' });

        req.user = customer;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = customerAuth;