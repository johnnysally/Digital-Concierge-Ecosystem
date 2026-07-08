const router = require('express').Router();

router.use('/auth', require('./customer/customerRoutes'));
router.use('/bookings', require('./customer/bookingRoutes'));
router.use('/reviews', require('./customer/reviewRoutes'));
router.use('/payments', require('./customer/paymentRoutes'));
router.use('/chat', require('./customer/chatRoutes'));
router.use('/wallet', require('./customer/walletRoutes'));

module.exports = router;