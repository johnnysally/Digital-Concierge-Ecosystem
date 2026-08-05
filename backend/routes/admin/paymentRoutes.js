const router = require('express').Router();
const { getAllPayments, getPayment, refundPayment, getPayouts, releasePayout, getCommissionRates, updateCommissionRate } = require('../../controllers/admin/paymentController');
const adminAuth = require('../../middleware/admin/adminAuth');

router.use(adminAuth);
router.get('/', getAllPayments);
router.get('/payouts', getPayouts);
router.post('/payouts/release', releasePayout);
router.get('/commissions', getCommissionRates);
router.put('/commissions/:type', updateCommissionRate);
router.get('/:id', getPayment);
router.put('/:id/refund', refundPayment);

module.exports = router;