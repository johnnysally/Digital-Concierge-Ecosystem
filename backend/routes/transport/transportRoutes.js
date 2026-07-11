const router = require('express').Router();
const { register, login, getProfile, updateProfile, changePassword, forgotPassword, resetPassword } = require('../../controllers/transport/transportController');
const transportAuth = require('../../middleware/transport/transportAuth');
const { registerRules, loginRules } = require('../../middleware/transport/transportValidate');
const { authLimiter } = require('../../middleware/global/rateLimiter');

router.post('/register', authLimiter, registerRules, register);
router.post('/login', authLimiter, loginRules, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

router.use(transportAuth);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

module.exports = router;