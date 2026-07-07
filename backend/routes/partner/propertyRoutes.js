const router = require('express').Router();
const { createProperty, getMyProperties, getProperty, updateProperty, deleteProperty } = require('../../controllers/partner/propertyController');
const partnerAuth = require('../../middleware/partner/partnerAuth');
const { propertyRules } = require('../../middleware/partner/partnerValidate');

router.use(partnerAuth);
router.post('/', propertyRules, createProperty);
router.get('/', getMyProperties);
router.get('/:id', getProperty);
router.put('/:id', updateProperty);
router.delete('/:id', deleteProperty);

module.exports = router;