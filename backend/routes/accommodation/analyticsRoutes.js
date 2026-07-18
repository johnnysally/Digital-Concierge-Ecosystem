const router = require('express').Router();
const { getAccommodationAnalytics } = require('../../controllers/accommodation/analyticsController');
const accommodationAuth = require('../../middleware/accommodation/accommodationAuth');

router.get('/', accommodationAuth, getAccommodationAnalytics);

module.exports = router;
