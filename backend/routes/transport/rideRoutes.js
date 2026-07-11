const router = require('express').Router();
const { getRides, getRide, updateRideStatus, deleteRide } = require('../../controllers/transport/rideController');
const transportAuth = require('../../middleware/transport/transportAuth');

router.use(transportAuth);
router.get('/', getRides);
router.get('/:id', getRide);
router.put('/:id/status', updateRideStatus);
router.delete('/:id', deleteRide);

module.exports = router;