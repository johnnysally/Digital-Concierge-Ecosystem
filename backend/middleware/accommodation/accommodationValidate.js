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

const propertyRules = [
    body('name').trim().notEmpty().withMessage('Property name is required'),
    body('address.city').trim().notEmpty().withMessage('City is required'),
    body('address.country').trim().notEmpty().withMessage('Country is required'),
    handleValidation,
];

const roomRules = [
    body('property').isMongoId().withMessage('Valid property ID is required'),
    body('roomNumber').trim().notEmpty().withMessage('Room number is required'),
    body('type').trim().notEmpty().withMessage('Room type is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    handleValidation,
];

const staffRules = [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('role').trim().notEmpty().withMessage('Role is required'),
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

module.exports = { registerRules, loginRules, propertyRules, roomRules, staffRules, promotionRules };