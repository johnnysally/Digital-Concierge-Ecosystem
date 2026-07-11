const router = require('express').Router();

router.use('/auth', require('./accommodation/accommodationRoutes'));
router.use('/properties', require('./accommodation/propertyRoutes'));
router.use('/rooms', require('./accommodation/roomRoutes'));
router.use('/reservations', require('./accommodation/reservationRoutes'));
router.use('/guests', require('./accommodation/guestRoutes'));
router.use('/staff', require('./accommodation/staffRoutes'));
router.use('/promotions', require('./accommodation/promotionRoutes'));
router.use('/housekeeping', require('./accommodation/housekeepingRoutes'));
router.use('/documents', require('./accommodation/documentRoutes'));

module.exports = router;