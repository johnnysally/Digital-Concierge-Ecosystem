const router = require('express').Router();
const { createProperty, getMyProperties, getProperty, updateProperty, deleteProperty } = require('../../controllers/accommodation/propertyController');
const accommodationAuth = require('../../middleware/accommodation/accommodationAuth');
const { propertyRules } = require('../../middleware/accommodation/accommodationValidate');

router.use(accommodationAuth);
router.post('/', propertyRules, createProperty);
router.get('/', getMyProperties);
router.get('/:id', getProperty);
router.put('/:id', updateProperty);
router.delete('/:id', deleteProperty);

module.exports = router;