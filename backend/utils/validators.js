const { validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    next();
};

const isObjectId = (value) => /^[0-9a-fA-F]{24}$/.test(value);

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone) => /^\+?[\d\s-]{7,15}$/.test(phone);

module.exports = { handleValidation, isObjectId, isValidEmail, isValidPhone };