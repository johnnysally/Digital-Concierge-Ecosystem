const router = require('express').Router();
const { getOrders, getOrder, updateOrderStatus, deleteOrder } = require('../../controllers/restaurant/orderController');
const restaurantAuth = require('../../middleware/restaurant/restaurantAuth');

router.use(restaurantAuth);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

module.exports = router;