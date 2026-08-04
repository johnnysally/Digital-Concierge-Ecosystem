const router = require('express').Router();
const { createReservation, getReservations, getReservation, updateReservationStatus, deleteReservation } = require('../../controllers/accommodation/reservationController');
const accommodationAuth = require('../../middleware/accommodation/accommodationAuth');

router.use(accommodationAuth);
router.post('/', createReservation);
router.get('/', getReservations);
router.get('/:id', getReservation);
router.put('/:id/status', updateReservationStatus);
router.delete('/:id', deleteReservation);

module.exports = router;