const router = require('express').Router();
const { getWallet, topUp, confirmTopUp, addPaymentMethod, updatePaymentMethod, removePaymentMethod } = require('../../controllers/customer/walletController');
const customerAuth = require('../../middleware/customer/customerAuth');

router.use(customerAuth);
router.get('/', getWallet);
router.post('/topup', topUp);
router.post('/topup/confirm', confirmTopUp);
router.post('/methods', addPaymentMethod);
router.put('/methods/:id', updatePaymentMethod);
router.delete('/methods/:id', removePaymentMethod);

module.exports = router;