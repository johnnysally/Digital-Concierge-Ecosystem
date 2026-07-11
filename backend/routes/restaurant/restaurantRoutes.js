const router = require('express').Router();
const { register, login, getProfile, updateProfile, changePassword, forgotPassword, resetPassword } = require('../../controllers/restaurant/restaurantController');
const restaurantAuth = require('../../middleware/restaurant/restaurantAuth');
const { registerRules, loginRules } = require('../../middleware/restaurant/restaurantValidate');
const { authLimiter } = require('../../middleware/global/rateLimiter');

router.post('/register', authLimiter, registerRules, register);
router.post('/login', authLimiter, loginRules, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

router.use(restaurantAuth);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

module.exports = router;