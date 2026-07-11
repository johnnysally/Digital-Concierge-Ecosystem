const router = require('express').Router();
const { register, login, getProfile, updateProfile, changePassword, forgotPassword, resetPassword, addAddress, deleteAddress, deleteAccount } = require('../../controllers/customer/customerController');
const customerAuth = require('../../middleware/customer/customerAuth');
const { registerRules, loginRules } = require('../../middleware/customer/customerValidate');
const { authLimiter } = require('../../middleware/global/rateLimiter');

router.post('/register', authLimiter, registerRules, register);
router.post('/login', authLimiter, loginRules, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

router.use(customerAuth);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.post('/addresses', addAddress);
router.delete('/addresses/:id', deleteAddress);
router.delete('/account', deleteAccount);

module.exports = router;