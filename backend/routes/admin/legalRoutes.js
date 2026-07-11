const router = require('express').Router();
const { getLegalPage, updateLegalPage, getAllLegalPages, getPublicLegalPage } = require('../../controllers/admin/legalController');
const adminAuth = require('../../middleware/admin/adminAuth');

router.get('/public/:type', getPublicLegalPage);

router.use(adminAuth);
router.get('/', getAllLegalPages);
router.get('/:type', getLegalPage);
router.put('/:type', updateLegalPage);

module.exports = router;