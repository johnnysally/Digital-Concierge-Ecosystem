const router = require('express').Router();
const { getAllSettings, getSettingsByCategory, updateSetting, bulkUpdateSettings, getCommissions, updateCommission, getPublicSettings } = require('../../controllers/admin/settingsController');
const adminAuth = require('../../middleware/admin/adminAuth');

router.get('/public', getPublicSettings);

router.use(adminAuth);
router.get('/', getAllSettings);
router.get('/category/:category', getSettingsByCategory);
router.get('/commissions', getCommissions);
router.put('/commissions/:type', updateCommission);
router.put('/:key', updateSetting);
router.post('/bulk', bulkUpdateSettings);

module.exports = router;