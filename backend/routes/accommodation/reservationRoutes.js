const router = require('express').Router();
const { getReservations, getReservation, updateReservationStatus, updateReservationPaymentStatus, createReservation, deleteReservation } = require('../../controllers/accommodation/reservationController');
const accommodationAuth = require('../../middleware/accommodation/accommodationAuth');

router.use(accommodationAuth);
router.get('/', getReservations);
router.get('/:id', getReservation);
router.put('/:id/status', updateReservationStatus);
router.put('/:id/payment-status', updateReservationPaymentStatus);
router.post('/', createReservation);
router.delete('/:id', deleteReservation);

module.exports = router;