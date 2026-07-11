const router = require('express').Router();
const { getAllDisputes, getDispute, updateDispute } = require('../../controllers/admin/disputeController');
const adminAuth = require('../../middleware/admin/adminAuth');
const { disputeRules } = require('../../middleware/admin/adminValidate');

router.use(adminAuth);
router.get('/', getAllDisputes);
router.get('/:id', getDispute);
router.put('/:id', disputeRules, updateDispute);

module.exports = router;