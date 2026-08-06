const router = require('express').Router();
const ctrl = require('../../controllers/transport/rideController');
const transportAuth = require('../../middleware/transport/transportAuth');

router.use(transportAuth);
router.get('/', ctrl.getRides);
router.get('/:id', ctrl.getRide);
router.put('/:id/status', ctrl.updateRideStatus);
router.delete('/:id', ctrl.deleteRide);

module.exports = router;