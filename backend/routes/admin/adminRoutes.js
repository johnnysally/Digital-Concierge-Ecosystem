const router = require('express').Router();
const { register, login, getProfile, updateProfile, changePassword, forgotPassword, resetPassword, getAllAdmins, updateAdmin, deleteAdmin } = require('../../controllers/admin/adminController');
const adminAuth = require('../../middleware/admin/adminAuth');
const { registerRules, loginRules } = require('../../middleware/admin/adminValidate');
const { authLimiter } = require('../../middleware/global/rateLimiter');

router.post('/register', authLimiter, registerRules, register);
router.post('/login', authLimiter, loginRules, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

router.use(adminAuth);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.get('/', getAllAdmins);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

module.exports = router;