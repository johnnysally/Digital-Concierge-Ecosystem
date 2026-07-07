const router = require('express').Router();
const { createBooking, getMyBookings, getBooking, cancelBooking } = require('../../controllers/customer/bookingController');
const customerAuth = require('../../middleware/customer/customerAuth');
const { bookingRules } = require('../../middleware/customer/customerValidate');

router.use(customerAuth);
router.post('/', bookingRules, createBooking);
router.get('/', getMyBookings);
router.get('/:id', getBooking);
router.put('/:id/cancel', cancelBooking);

module.exports = router;