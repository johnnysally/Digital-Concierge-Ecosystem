const router = require('express').Router();
const { register, login, getProfile, updateProfile, changePassword, forgotPassword, resetPassword } = require('../../controllers/accommodation/accommodationController');
const accommodationAuth = require('../../middleware/accommodation/accommodationAuth');
const { registerRules, loginRules } = require('../../middleware/accommodation/accommodationValidate');
const { authLimiter } = require('../../middleware/global/rateLimiter');

router.post('/register', authLimiter, registerRules, register);
router.post('/login', authLimiter, loginRules, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

router.use(accommodationAuth);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

module.exports = router;