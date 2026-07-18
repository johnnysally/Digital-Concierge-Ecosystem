const router = require('express').Router();
const { getAccommodationAnalytics } = require('../../controllers/accommodation/analyticsController');
const auth = require('../../middleware/accommodation/authMiddleware');

router.get('/', auth, getAccommodationAnalytics);

module.exports = router;
