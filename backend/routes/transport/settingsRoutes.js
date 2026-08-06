const router = require('express').Router();
const ctrl = require('../../controllers/transport/settingsController');
const transportAuth = require('../../middleware/transport/transportAuth');

router.use(transportAuth);
router.get('/', ctrl.getSettings);
router.put('/', ctrl.updateSettings);

module.exports = router;