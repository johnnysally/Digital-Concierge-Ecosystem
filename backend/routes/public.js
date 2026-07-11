const router = require('express').Router();
const { getPublicConfig, getTerms, getPrivacy, getCookies } = require('../controllers/admin/publicController');
const { searchProperties, getProperty } = require('../controllers/accommodation/publicController');
const { searchMenu, getMenuItem } = require('../controllers/restaurant/publicController');
const { searchVehicles, getVehicle } = require('../controllers/transport/publicController');

router.get('/config', getPublicConfig);
router.get('/terms', getTerms);
router.get('/privacy', getPrivacy);
router.get('/cookies', getCookies);

router.get('/properties', searchProperties);
router.get('/properties/:id', getProperty);
router.get('/menu', searchMenu);
router.get('/menu/:id', getMenuItem);
router.get('/vehicles', searchVehicles);
router.get('/vehicles/:id', getVehicle);

module.exports = router;