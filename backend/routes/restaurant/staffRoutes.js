const router = require('express').Router();
const { createStaff, getStaff, getStaffMember, updateStaff, deleteStaff } = require('../../controllers/restaurant/staffController');
const restaurantAuth = require('../../middleware/restaurant/restaurantAuth');
const { staffRules } = require('../../middleware/restaurant/restaurantValidate');

router.use(restaurantAuth);
router.post('/', staffRules, createStaff);
router.get('/', getStaff);
router.get('/:id', getStaffMember);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

module.exports = router;