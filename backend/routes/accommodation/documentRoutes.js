const router = require('express').Router();
const { createDocument, getDocuments, getDocument, deleteDocument,updateDocument } = require('../../controllers/accommodation/documentController');
const accommodationAuth = require('../../middleware/accommodation/accommodationAuth');

router.use(accommodationAuth);
router.post('/', createDocument);
router.get('/', getDocuments);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);
router.put('/:id', updateDocument);

module.exports = router;