const Order = require('../../models/restaurant/Order');
const MenuItem = require('../../models/restaurant/MenuItem');
const RestaurantPartner = require('../../models/restaurant/RestaurantPartner');
const { customer: customerEmails, partner: partnerEmails } = require('../../services/emailService');
const { createNotification } = require('../../services/notificationService');
const logger = require('../../utils/logger');

const createOrder = async (req, res, next) => {
    try {
        const { items, orderType, deliveryAddress, customerPhone, notes } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No items provided.' });
        }

        if (orderType === 'delivery' && (!deliveryAddress || !deliveryAddress.street)) {
            return res.status(400).json({ success: false, message: 'Delivery address is required for delivery orders.' });
        }

        let partnerId = null;
        const validatedItems = [];

        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItem);
            if (!menuItem) return res.status(404).json({ success: false, message: `Menu item "${item.name}" not found.` });
            if (!menuItem.available) return res.status(400).json({ success: false, message: `"${menuItem.name}" is currently unavailable.` });
            if (!partnerId) partnerId = menuItem.partner;
            if (menuItem.partner.toString() !== partnerId.toString()) {
                return res.status(400).json({ success: false, message: 'All items must be from the same restaurant.' });
            }
            validatedItems.push({
                menuItem: menuItem._id,
                name: menuItem.name,
                quantity: item.quantity || 1,
                price: menuItem.price,
            });
        }

        const restaurant = await RestaurantPartner.findById(partnerId);
        if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

        const subtotal = validatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const deliveryFee = orderType === 'delivery' ? (restaurant.deliveryFee || 0) : 0;
        const total = subtotal + deliveryFee;

        if (restaurant.minOrder > 0 && subtotal < restaurant.minOrder) {
            return res.status(400).json({ success: false, message: `Minimum order amount is KES ${restaurant.minOrder}.` });
        }

        const estimatedTime = 20;

        const phone = customerPhone || req.user.phone || '';

        const order = await Order.create({
            partner: partnerId,
            customer: req.user._id,
            customerPhone: phone,
            items: validatedItems,
            orderType: orderType || 'delivery',
            deliveryAddress,
            notes,
            subtotal,
            deliveryFee,
            total,
            estimatedTime,
            status: 'pending',
        });

        const customerName = `${req.user.firstName} ${req.user.lastName}`;

        customerEmails.sendOrderConfirmed(req.user, {
            restaurantName: restaurant.businessName,
            itemsCount: validatedItems.length,
            orderType: orderType || 'delivery',
            total,
            estimatedTime,
            deliveryAddress: deliveryAddress?.street || 'N/A',
            phone,
            notes: notes || '',
            items: validatedItems,
        }).catch(e => logger.error(`Order confirmation email failed: ${e.message}`));

        createNotification({
            customerId: req.user._id,
            type: 'food',
            title: 'Order Placed',
            message: `Your order from ${restaurant.businessName} has been placed. Total: KES ${total}.`,
        }).catch(e => logger.error(`Notification failed: ${e.message}`));

        partnerEmails.sendNewOrder(restaurant, {
            id: order._id,
            customerName,
            itemsCount: validatedItems.length,
            orderType: orderType || 'delivery',
            total,
            deliveryAddress: deliveryAddress?.street || 'N/A',
            phone,
            notes: notes || '',
            items: validatedItems,
        }).catch(e => logger.error(`Restaurant notification email failed: ${e.message}`));

        res.status(201).json({ success: true, order });
    } catch (error) { next(error); }
};

const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ customer: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('partner', 'businessName');
        res.json({ success: true, orders });
    } catch (error) { next(error); }
};

module.exports = { createOrder, getMyOrders };