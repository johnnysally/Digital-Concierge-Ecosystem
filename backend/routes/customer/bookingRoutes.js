const router = require('express').Router();
const { createBooking, getMyBookings, getBooking, cancelBooking } = require('../../controllers/customer/bookingController');
const Booking = require('../../models/customer/Booking');
const customerAuth = require('../../middleware/customer/customerAuth');
const { bookingRules } = require('../../middleware/customer/customerValidate');

router.post('/', bookingRules, createBooking);
router.get('/', customerAuth, getMyBookings);
router.get('/:id', customerAuth, getBooking);
router.put('/:id/cancel', customerAuth, cancelBooking);

router.put('/:id/confirm-receipt', customerAuth, async (req, res, next) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id, customer: req.user._id });
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
        if (booking.status !== 'checked_out') return res.status(400).json({ success: false, message: 'Guest must be checked out first' });
        booking.status = 'completed';
        await booking.save();
        res.json({ success: true, booking, message: 'Stay confirmed. Thank you!' });
    } catch (error) { next(error); }
});

module.exports = router;