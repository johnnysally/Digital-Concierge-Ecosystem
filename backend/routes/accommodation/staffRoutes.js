const router = require('express').Router();
const { createStaff, getStaff, getStaffMember, updateStaff, deleteStaff } = require('../../controllers/accommodation/staffController');
const accommodationAuth = require('../../middleware/accommodation/accommodationAuth');
const { staffRules } = require('../../middleware/accommodation/accommodationValidate');

router.use(accommodationAuth);
router.post('/', staffRules, createStaff);
router.get('/', getStaff);
router.get('/:id', getStaffMember);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

module.exports = router;