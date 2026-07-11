const router = require('express').Router();

router.use('/auth', require('./customer/customerRoutes'));
router.use('/bookings', require('./customer/bookingRoutes'));
router.use('/reviews', require('./customer/reviewRoutes'));
router.use('/payments', require('./customer/paymentRoutes'));
router.use('/chat', require('./customer/chatRoutes'));
router.use('/wallet', require('./customer/walletRoutes'));
router.use('/orders', require('./customer/orderRoutes'));
router.use('/rides', require('./customer/rideRoutes'));
router.use('/support', require('./customer/supportRoutes'));

module.exports = router;