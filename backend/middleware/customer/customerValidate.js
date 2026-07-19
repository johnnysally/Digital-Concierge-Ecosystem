const { body } = require('express-validator');
const { handleValidation } = require('../../utils/validators');

const registerRules = [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').optional().trim(),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().trim(),
    handleValidation,
];

const loginRules = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidation,
];

const bookingRules = [
    body('propertyId').isMongoId().withMessage('Valid property ID is required'),
    body('roomId').isMongoId().withMessage('Valid room ID is required'),
    body('checkIn').isISO8601().withMessage('Valid check-in date is required'),
    body('checkOut').isISO8601().withMessage('Valid check-out date is required'),
    handleValidation,
];

const reviewRules = [
    body('bookingId').isMongoId().withMessage('Valid booking ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim(),
    handleValidation,
];

const paymentRules = [
    body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount is required'),
    body('method').isIn(['stripe', 'mpesa', 'wallet']).withMessage('Valid payment method is required'),
    handleValidation,
];

module.exports = { registerRules, loginRules, bookingRules, reviewRules, paymentRules };