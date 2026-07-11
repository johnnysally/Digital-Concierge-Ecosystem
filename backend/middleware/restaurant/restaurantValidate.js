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

const menuRules = [
    body('name').trim().notEmpty().withMessage('Item name is required'),
    body('category').isIn(['appetizer', 'main', 'dessert', 'beverage', 'side', 'combo']).withMessage('Valid category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    handleValidation,
];

const staffRules = [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('role').isIn(['manager', 'chef', 'waiter', 'delivery', 'cashier', 'other']).withMessage('Valid role is required'),
    handleValidation,
];

const promotionRules = [
    body('code').trim().notEmpty().withMessage('Promo code is required'),
    body('discountType').isIn(['percentage', 'fixed', 'buy_one_get_one']).withMessage('Discount type is required'),
    body('discountValue').isFloat({ min: 0 }).withMessage('Valid discount value is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('expiryDate').isISO8601().withMessage('Valid expiry date is required'),
    handleValidation,
];

module.exports = { registerRules, loginRules, menuRules, staffRules, promotionRules };