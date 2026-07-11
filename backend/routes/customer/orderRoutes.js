const router = require('express').Router();
const { createOrder, getMyOrders } = require('../../controllers/customer/orderController');
const customerAuth = require('../../middleware/customer/customerAuth');

router.use(customerAuth);
router.post('/', createOrder);
router.get('/', getMyOrders);

module.exports = router;