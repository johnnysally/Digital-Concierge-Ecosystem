const router = require('express').Router();
const { getPublicConfig, getTerms, getPrivacy, getCookies, getSupportInfo, submitContact } = require('../controllers/admin/publicController');
const { searchProperties, getProperty } = require('../controllers/accommodation/publicController');
const { searchMenu, getMenuItem } = require('../controllers/restaurant/publicController');
const { searchVehicles, getVehicle, calculatePublicFare } = require('../controllers/transport/publicController');
const Town = require('../models/admin/Town');
const Destination = require('../models/admin/Destination');

router.get('/config', getPublicConfig);
router.get('/terms', getTerms);
router.get('/privacy', getPrivacy);
router.get('/cookies', getCookies);
router.get('/support', getSupportInfo);
router.post('/contact', submitContact);

router.get('/properties', searchProperties);
router.get('/properties/:id', getProperty);
router.get('/menu', searchMenu);
router.get('/menu/:id', getMenuItem);
router.get('/vehicles', searchVehicles);
router.get('/vehicles/:id', getVehicle);
router.post('/calculate-fare', calculatePublicFare);


router.get('/towns', async (req, res) => {
    const towns = await Town.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, towns });
});

router.get('/destinations', async (req, res) => {
    const { town } = req.query;
    const query = { isActive: true };
    if (town) query.town = town;
    const destinations = await Destination.find(query).populate('town', 'name').sort({ name: 1 });
    res.json({ success: true, destinations });
});

module.exports = router;