const router = require('express').Router();
const ctrl = require('../../controllers/transport/driverController');
const transportAuth = require('../../middleware/transport/transportAuth');

router.use(transportAuth);
router.post('/', ctrl.createDriver);
router.get('/', ctrl.getDrivers);
router.get('/:id', ctrl.getDriver);
router.put('/:id', ctrl.updateDriver);
router.delete('/:id', ctrl.deleteDriver);
router.put('/:id/toggle-status', ctrl.toggleStatus);

module.exports = router;