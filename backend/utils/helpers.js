const crypto = require('crypto');

const generateToken = (bytes = 32) => {
    return crypto.randomBytes(bytes).toString('hex');
};

const generateOTP = (length = 6) => {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)).toString();
};

const sanitizeUser = (user) => {
    const { password, refreshToken, resetPasswordToken, resetPasswordExpire, __v, ...sanitized } = user.toObject ? user.toObject() : user;
    return sanitized;
};

const paginate = (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return { skip, limit: parseInt(limit) };
};

const buildQuery = (queryParams, allowedFields) => {
    const query = {};
    Object.keys(queryParams).forEach((key) => {
        if (allowedFields.includes(key) && queryParams[key]) {
            query[key] = queryParams[key];
        }
    });
    return query;
};

module.exports = { generateToken, generateOTP, sanitizeUser, paginate, buildQuery };