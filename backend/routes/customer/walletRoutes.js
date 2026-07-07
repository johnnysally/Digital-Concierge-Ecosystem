const router = require('express').Router();
const { getWallet, topUp, addPaymentMethod, removePaymentMethod } = require('../../controllers/customer/walletController');
const customerAuth = require('../../middleware/customer/customerAuth');

router.use(customerAuth);
router.get('/', getWallet);
router.post('/topup', topUp);
router.post('/methods', addPaymentMethod);
router.delete('/methods/:id', removePaymentMethod);

module.exports = router;