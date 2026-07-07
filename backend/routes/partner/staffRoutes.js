const router = require('express').Router();
const { createStaff, getStaff, getStaffMember, updateStaff, deleteStaff } = require('../../controllers/partner/staffController');
const partnerAuth = require('../../middleware/partner/partnerAuth');
const { staffRules } = require('../../middleware/partner/partnerValidate');

router.use(partnerAuth);
router.post('/', staffRules, createStaff);
router.get('/', getStaff);
router.get('/:id', getStaffMember);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

module.exports = router;