const Order = require('../../models/restaurant/Order');

const getOrders = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const query = { partner: req.user._id };
        if (status) query.status = status;
        const orders = await Order.find(query)
            .populate('customer', 'firstName lastName phone')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit).limit(parseInt(limit));
        const total = await Order.countDocuments(query);
        res.json({ success: true, orders, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) { next(error); }
};

const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, partner: req.user._id }).populate('customer').populate('items.menuItem');
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, order });
    } catch (error) { next(error); }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const update = { status };
        if (status === 'delivered') update.deliveredAt = new Date();
        const order = await Order.findOneAndUpdate({ _id: req.params.id, partner: req.user._id }, update, { new: true });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, order });
    } catch (error) { next(error); }
};

const deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findOneAndDelete({ _id: req.params.id, partner: req.user._id });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, message: 'Order deleted' });
    } catch (error) { next(error); }
};

module.exports = { getOrders, getOrder, updateOrderStatus, deleteOrder };