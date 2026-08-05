const router = require('express').Router();
const { createOrder, getMyOrders } = require('../../controllers/customer/orderController');
const customerAuth = require('../../middleware/customer/customerAuth');
const Order = require('../../models/restaurant/Order');

router.use(customerAuth);
router.post('/', createOrder);
router.get('/', getMyOrders);
router.put('/:id/confirm-receipt', customerAuth, async (req, res, next) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, customer: req.user._id });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.status !== 'delivered') return res.status(400).json({ success: false, message: 'Order must be delivered first' });
        order.status = 'completed';
        await order.save();
        res.json({ success: true, order, message: 'Receipt confirmed. Thank you!' });
    } catch (error) { next(error); }
});

module.exports = router;