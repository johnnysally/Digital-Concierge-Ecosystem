const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/env');
const Partner = require('../../models/partner/Partner');

const partnerAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ success: false, message: 'Access denied' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const partner = await Partner.findById(decoded.id);
        if (!partner) return res.status(401).json({ success: false, message: 'Partner not found' });

        req.user = partner;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = partnerAuth;