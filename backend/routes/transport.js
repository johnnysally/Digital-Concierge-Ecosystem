const router = require('express').Router();

router.use('/auth', require('./transport/transportRoutes'));
router.use('/vehicles', require('./transport/vehicleRoutes'));
router.use('/rides', require('./transport/rideRoutes'));
router.use('/drivers', require('./transport/driverRoutes'));
router.use('/promotions', require('./transport/promotionRoutes'));
router.use('/map', require('./transport/mapRoutes'));
router.use('/settings', require('./transport/settingsRoutes'));
router.use('/support', require('./transport/supportRoutes'));

module.exports = router;