const router = require('express').Router();
const { createStripePayment, confirmStripePayment, initiateMpesaPayment, mpesaCallback, getPaymentHistory,getPayment } = require('../../controllers/customer/paymentController');
const customerAuth = require('../../middleware/customer/customerAuth');

router.post('/mpesa-callback', mpesaCallback);

router.use(customerAuth);
router.post('/stripe', createStripePayment);
router.post('/stripe/confirm', confirmStripePayment);
router.post('/mpesa', initiateMpesaPayment);
router.get('/', getPaymentHistory);
router.get('/:id', getPayment);

module.exports = router;