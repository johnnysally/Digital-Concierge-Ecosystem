const router = require('express').Router();
const { getReservations, getReservation, updateReservationStatus } = require('../../controllers/partner/reservationController');
const partnerAuth = require('../../middleware/partner/partnerAuth');

router.use(partnerAuth);
router.get('/', getReservations);
router.get('/:id', getReservation);
router.put('/:id/status', updateReservationStatus);

module.exports = router;