const router = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const ctrl = require('../../controllers/transport/vehicleController');
const transportAuth = require('../../middleware/transport/transportAuth');
const { vehicleRules } = require('../../middleware/transport/transportValidate');

router.use(transportAuth);
router.post('/', vehicleRules, ctrl.createVehicle);
router.get('/', ctrl.getVehicles);
router.get('/:id', ctrl.getVehicle);
router.put('/:id', ctrl.updateVehicle);
router.delete('/:id', ctrl.deleteVehicle);
router.put('/:id/toggle-availability', ctrl.toggleAvailability);
router.put('/:id/dispatch', ctrl.updateDispatchStatus);
router.post('/:id/maintenance', ctrl.addMaintenanceRecord);
router.get('/:id/maintenance', ctrl.getMaintenanceHistory);
router.post('/upload-images', upload.array('images', 5), ctrl.uploadVehicleImages);

module.exports = router;