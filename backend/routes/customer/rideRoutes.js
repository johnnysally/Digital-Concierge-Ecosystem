const router = require('express').Router();
const { createRide, getMyRides } = require('../../controllers/customer/rideController');
const customerAuth = require('../../middleware/customer/customerAuth');
const Ride = require('../../models/transport/Ride');

router.use(customerAuth);
router.post('/', createRide);
router.get('/', getMyRides);
router.put('/:id/confirm-receipt', customerAuth, async (req, res, next) => {
    try {
        const ride = await Ride.findOne({ _id: req.params.id, customer: req.user._id });
        if (!ride) return res.status(404).json({ success: false, message: 'Ride not found' });
        if (ride.status !== 'delivered' && ride.status !== 'completed') return res.status(400).json({ success: false, message: 'Ride not ready for confirmation' });
        ride.status = 'completed';
        await ride.save();
        res.json({ success: true, ride, message: 'Receipt confirmed. Thank you!' });
    } catch (error) { next(error); }
});

module.exports = router;