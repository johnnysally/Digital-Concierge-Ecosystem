const router = require('express').Router();
const { createVehicle, getVehicles, getVehicle, updateVehicle, deleteVehicle, toggleAvailability, addMaintenanceRecord, getMaintenanceHistory, updateDispatchStatus, uploadVehicleImages } = require('../../controllers/transport/vehicleController');
const transportAuth = require('../../middleware/transport/transportAuth');
const { vehicleRules } = require('../../middleware/transport/transportValidate');

router.use(transportAuth);
router.post('/', vehicleRules, createVehicle);
router.get('/', getVehicles);
router.get('/:id', getVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);
router.put('/:id/toggle-availability', toggleAvailability);
router.put('/:id/dispatch', updateDispatchStatus);
router.post('/:id/maintenance', addMaintenanceRecord);
router.get('/:id/maintenance', getMaintenanceHistory);
router.post('/upload-images', uploadVehicleImages);

module.exports = router;