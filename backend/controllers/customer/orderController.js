const Order = require('../../models/restaurant/Order');
const MenuItem = require('../../models/restaurant/MenuItem');
const { createNotification } = require('../../services/notificationService');
const logger = require('../../utils/logger');

const createOrder = async (req, res, next) => {
    try {
        const { items, orderType, deliveryAddress, notes } = req.body;
        if (!items || items.length === 0) return res.status(400).json({ success: false, message: 'No items provided' });

        const firstItem = await MenuItem.findById(items[0].menuItem);
        if (!firstItem) return res.status(404).json({ success: false, message: 'Menu item not found' });

        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const restaurant = await require('../../models/restaurant/RestaurantPartner').findById(firstItem.partner);
        const deliveryFee = restaurant?.deliveryFee || 0;
        const total = subtotal + deliveryFee;

        const order = await Order.create({
            partner: firstItem.partner,
            customer: req.user._id,
            items,
            orderType: orderType || 'delivery',
            deliveryAddress,
            notes,
            subtotal,
            deliveryFee,
            total,
            currency: 'KES',
        });

        createNotification({
            customerId: req.user._id, type: 'food', title: 'Order Placed',
            message: `Your order #${order._id} has been placed.`,
        }).catch(e => logger.error(`Notification failed: ${e.message}`));

        res.status(201).json({ success: true, order });
    } catch (error) { next(error); }
};

const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 }).limit(20);
        res.json({ success: true, orders });
    } catch (error) { next(error); }
};

module.exports = { createOrder, getMyOrders };