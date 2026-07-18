const router = require('express').Router();
const { getAccommodationSettings, updateAccommodationSettings } = require('../../controllers/accommodation/settingsController');
const accommodationAuth = require('../../middleware/accommodation/accommodationAuth');

router.use(accommodationAuth);
router.get('/', getAccommodationSettings);
router.put('/', updateAccommodationSettings);

module.exports = router;
