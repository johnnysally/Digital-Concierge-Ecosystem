const router = require('express').Router();
const { createProperty, getMyProperties, getProperty, updateProperty, deleteProperty, uploadPropertyImages } = require('../../controllers/accommodation/propertyController');
const accommodationAuth = require('../../middleware/accommodation/accommodationAuth');
const { propertyRules } = require('../../middleware/accommodation/accommodationValidate');
const upload = require('../../middleware/global/upload');

router.use(accommodationAuth);
router.post('/', propertyRules, createProperty);
router.post('/upload-images', upload.array('images', 8), uploadPropertyImages);
router.get('/', getMyProperties);
router.get('/:id', getProperty);
router.put('/:id', updateProperty);
router.delete('/:id', deleteProperty);

module.exports = router;