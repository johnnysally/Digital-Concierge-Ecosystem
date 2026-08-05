const Order = require('../../models/restaurant/Order');
const MenuItem = require('../../models/restaurant/MenuItem');
const RestaurantPartner = require('../../models/restaurant/RestaurantPartner');
const { partner: partnerEmails } = require('../../services/emailService');
const { createNotification } = require('../../services/notificationService');
const logger = require('../../utils/logger');

const createOrder = async (req, res, next) => {
    try {
        const { items, orderType, deliveryAddress, customerPhone, notes } = req.body;

        if (!items || items.length === 0) return res.status(400).json({ success: false, message: 'No items provided.' });
        if (orderType === 'delivery' && (!deliveryAddress || !deliveryAddress.street)) {
            return res.status(400).json({ success: false, message: 'Delivery address required.' });
        }

        let partnerId = null;
        const validatedItems = [];
        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItem);
            if (!menuItem) return res.status(404).json({ success: false, message: `Item "${item.name}" not found.` });
            if (!menuItem.available) return res.status(400).json({ success: false, message: `"${menuItem.name}" unavailable.` });
            if (!partnerId) partnerId = menuItem.partner;
            if (menuItem.partner.toString() !== partnerId.toString()) return res.status(400).json({ success: false, message: 'All items must be from same restaurant.' });
            validatedItems.push({ menuItem: menuItem._id, name: menuItem.name, quantity: item.quantity || 1, price: menuItem.price });
        }

        const restaurant = await RestaurantPartner.findById(partnerId);
        if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

        const subtotal = validatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const deliveryFee = orderType === 'delivery' ? (restaurant.deliveryFee || 0) : 0;
        const total = subtotal + deliveryFee;

        if (restaurant.minOrder > 0 && subtotal < restaurant.minOrder) {
            return res.status(400).json({ success: false, message: `Minimum order is KES ${restaurant.minOrder}.` });
        }

        const order = await Order.create({
            partner: partnerId, customer: req.user._id, customerPhone: customerPhone || req.user.phone || '',
            items: validatedItems, orderType: orderType || 'delivery', deliveryAddress, notes,
            subtotal, deliveryFee, total, estimatedTime: 20, status: 'confirmed', paymentStatus: 'paid',
        });

        const customerName = `${req.user.firstName} ${req.user.lastName}`;

       createNotification({
    partnerId: restaurant._id.toString(),
    type: 'food',
    title: 'New Order Received',
    message: customerName + ' placed an order. Total: KES ' + total + '.',
}).catch(e => logger.error('Partner notification failed: ' + e.message));

        partnerEmails.sendNewOrder(restaurant, {
            id: order._id, customerName, itemsCount: validatedItems.length,
            orderType: orderType || 'delivery', total,
            deliveryAddress: deliveryAddress?.street || 'N/A',
            phone: customerPhone || req.user.phone || '', notes: notes || '', items: validatedItems,
        }).catch(e => logger.error(`Partner notification failed: ${e.message}`));

        res.status(201).json({ success: true, order });
    } catch (error) { next(error); }
};

const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 }).limit(20).populate('partner', 'businessName');
        res.json({ success: true, orders });
    } catch (error) { next(error); }
};

module.exports = { createOrder, getMyOrders };