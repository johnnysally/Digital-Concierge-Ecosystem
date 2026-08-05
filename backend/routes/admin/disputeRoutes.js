const router = require('express').Router();
const { getAll, getOne, update, reply, remove } = require('../../controllers/admin/disputeController');
const adminAuth = require('../../middleware/admin/adminAuth');

router.use(adminAuth);
router.get('/', getAll);
router.get('/:id', getOne);
router.put('/:id', update);
router.post('/:id/reply', reply);
router.delete('/:id', remove);

module.exports = router;