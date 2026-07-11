const router = require('express').Router();
const { getAllTransactions, getTransaction, refundTransaction } = require('../../controllers/admin/transactionController');
const adminAuth = require('../../middleware/admin/adminAuth');

router.use(adminAuth);
router.get('/', getAllTransactions);
router.get('/:id', getTransaction);
router.put('/:id/refund', refundTransaction);

module.exports = router;