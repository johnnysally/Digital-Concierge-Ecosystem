const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: { success: false, message: 'Too many requests, please try again later' },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: 'Too many attempts, please try again later' },
});

const adminLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 200,
    message: { success: false, message: 'Too many requests' },
});

module.exports = { generalLimiter, authLimiter, adminLimiter };