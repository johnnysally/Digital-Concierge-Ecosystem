const router = require('express').Router();
const { createVehicle, getVehicles, getVehicle, updateVehicle, deleteVehicle } = require('../../controllers/transport/vehicleController');
const transportAuth = require('../../middleware/transport/transportAuth');
const { vehicleRules } = require('../../middleware/transport/transportValidate');

router.use(transportAuth);
router.post('/', vehicleRules, createVehicle);
router.get('/', getVehicles);
router.get('/:id', getVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;