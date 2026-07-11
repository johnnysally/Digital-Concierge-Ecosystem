const MenuItem = require('../../models/restaurant/MenuItem');

const searchMenu = async (req, res, next) => {
    try {
        const { category, search } = req.query;
        const query = { available: true };
        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };
        const items = await MenuItem.find(query).populate('partner', 'businessName').sort({ createdAt: -1 }).limit(50);
        res.json({ success: true, items });
    } catch (error) { next(error); }
};

const getMenuItem = async (req, res, next) => {
    try {
        const item = await MenuItem.findOne({ _id: req.params.id, available: true }).populate('partner', 'businessName');
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
        res.json({ success: true, item });
    } catch (error) { next(error); }
};

module.exports = { searchMenu, getMenuItem };