const router = require('express').Router();
const ctrl = require('../../controllers/transport/mapController');
const transportAuth = require('../../middleware/transport/transportAuth');

router.use(transportAuth);
router.get('/vehicles', ctrl.getActiveVehicles);
router.get('/vehicles/:id', ctrl.getVehicleLocation);
router.put('/vehicles/:id', ctrl.updateVehicleLocation);
router.get('/trips', ctrl.getActiveTrips);
router.get('/trips/:id', ctrl.getTripRoute);

module.exports = router;