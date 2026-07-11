const { body } = require('express-validator');
const { handleValidation } = require('../../utils/validators');

const registerRules = [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('businessName').trim().notEmpty().withMessage('Business name is required'),
    handleValidation,
];

const loginRules = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidation,
];

const vehicleRules = [
    body('type').isIn(['sedan', 'suv', 'van', 'bus', 'bike', 'tuk_tuk']).withMessage('Valid vehicle type is required'),
    body('make').trim().notEmpty().withMessage('Make is required'),
    body('model').trim().notEmpty().withMessage('Model is required'),
    body('plateNumber').trim().notEmpty().withMessage('Plate number is required'),
    body('pricePerKm').isFloat({ min: 0 }).withMessage('Valid price per km is required'),
    handleValidation,
];

const driverRules = [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('licenseNumber').trim().notEmpty().withMessage('License number is required'),
    handleValidation,
];

const promotionRules = [
    body('code').trim().notEmpty().withMessage('Promo code is required'),
    body('discountType').isIn(['percentage', 'fixed']).withMessage('Discount type is required'),
    body('discountValue').isFloat({ min: 0 }).withMessage('Valid discount value is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('expiryDate').isISO8601().withMessage('Valid expiry date is required'),
    handleValidation,
];

module.exports = { registerRules, loginRules, vehicleRules, driverRules, promotionRules };