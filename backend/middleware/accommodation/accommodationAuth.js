const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/env');
const AccommodationPartner = require('../../models/accommodation/AccommodationPartner');

const accommodationAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const partner = await AccommodationPartner.findById(decoded.id);

        if (!partner) return res.status(401).json({ success: false, message: 'Account not found. Please register.' });
        if (!partner.isVerified) return res.status(403).json({ success: false, message: 'Your account is pending admin approval. You will be notified once approved.', code: 'PENDING_APPROVAL' });
        if (!partner.isActive) return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support for assistance.', code: 'ACCOUNT_SUSPENDED' });

        req.user = partner;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') return res.status(401).json({ success: false, message: 'Invalid session. Please log in again.' });
        if (error.name === 'TokenExpiredError') return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
        next(error);
    }
};

module.exports = accommodationAuth;