const { body } = require('express-validator');
const { handleValidation } = require('../../utils/validators');

const registerRules = [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    handleValidation,
];

const loginRules = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidation,
];

const disputeRules = [
    body('status').isIn(['open', 'investigating', 'resolved', 'closed']).withMessage('Valid status is required'),
    handleValidation,
];

module.exports = { registerRules, loginRules, disputeRules };