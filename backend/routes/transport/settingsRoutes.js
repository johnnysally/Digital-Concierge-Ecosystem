const router = require('express').Router();
const { getSettings, updateSettings } = require('../../controllers/transport/settingsController');
const transportAuth = require('../../middleware/transport/transportAuth');

router.use(transportAuth);
router.get('/', getSettings);
router.put('/', updateSettings);

module.exports = router;