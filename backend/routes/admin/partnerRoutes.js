const router = require('express').Router();
const { getAllPartners, getPartner, approvePartner, suspendPartner, activatePartner, deletePartner } = require('../../controllers/admin/partnerController');
const adminAuth = require('../../middleware/admin/adminAuth');

router.use(adminAuth);
router.get('/', getAllPartners);
router.get('/:id', getPartner);
router.put('/:id/approve', approvePartner);
router.put('/:id/suspend', suspendPartner);
router.put('/:id/activate', activatePartner);
router.delete('/:id', deletePartner);

module.exports = router;