const router = require('express').Router();
const { getActiveVehicles, getVehicleLocation, updateVehicleLocation, getActiveTrips, getTripRoute } = require('../../controllers/transport/mapController');
const transportAuth = require('../../middleware/transport/transportAuth');

router.use(transportAuth);
router.get('/vehicles', getActiveVehicles);
router.get('/vehicles/:id', getVehicleLocation);
router.put('/vehicles/:id/location', updateVehicleLocation);
router.get('/active-trips', getActiveTrips);
router.get('/trips/:id', getTripRoute);

module.exports = router;