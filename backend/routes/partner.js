const router = require('express').Router();

router.use('/auth', require('./partner/partnerRoutes'));
router.use('/properties', require('./partner/propertyRoutes'));
router.use('/rooms', require('./partner/roomRoutes'));
router.use('/reservations', require('./partner/reservationRoutes'));
router.use('/staff', require('./partner/staffRoutes'));
router.use('/promotions', require('./partner/promotionRoutes'));
router.use('/housekeeping', require('./partner/housekeepingRoutes'));
router.use('/documents', require('./partner/documentRoutes'));

module.exports = router;