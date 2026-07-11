const router = require('express').Router();
const { createDriver, getDrivers, getDriver, updateDriver, deleteDriver } = require('../../controllers/transport/driverController');
const transportAuth = require('../../middleware/transport/transportAuth');
const { driverRules } = require('../../middleware/transport/transportValidate');

router.use(transportAuth);
router.post('/', driverRules, createDriver);
router.get('/', getDrivers);
router.get('/:id', getDriver);
router.put('/:id', updateDriver);
router.delete('/:id', deleteDriver);

module.exports = router;