const router = require('express').Router();

router.use('/auth', require('./transport/transportRoutes'));
router.use('/vehicles', require('./transport/vehicleRoutes'));
router.use('/rides', require('./transport/rideRoutes'));
router.use('/drivers', require('./transport/driverRoutes'));
router.use('/promotions', require('./transport/promotionRoutes'));

module.exports = router;