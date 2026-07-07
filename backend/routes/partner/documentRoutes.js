const router = require('express').Router();
const { createDocument, getDocuments, getDocument, deleteDocument } = require('../../controllers/partner/documentController');
const partnerAuth = require('../../middleware/partner/partnerAuth');

router.use(partnerAuth);
router.post('/', createDocument);
router.get('/', getDocuments);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);

module.exports = router;