const router = require('express').Router();
const { createRide, getMyRides } = require('../../controllers/customer/rideController');
const customerAuth = require('../../middleware/customer/customerAuth');

router.use(customerAuth);
router.post('/', createRide);
router.get('/', getMyRides);

module.exports = router;