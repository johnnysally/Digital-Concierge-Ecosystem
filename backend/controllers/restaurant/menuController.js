const MenuItem = require('../../models/restaurant/MenuItem');

const createItem = async (req, res, next) => {
    try {
        const item = await MenuItem.create({ ...req.body, partner: req.user._id });
        res.status(201).json({ success: true, item });
    } catch (error) { next(error); }
};

const getItems = async (req, res, next) => {
    try {
        const { category, available } = req.query;
        const query = { partner: req.user._id };
        if (category) query.category = category;
        if (available !== undefined) query.available = available === 'true';
        const items = await MenuItem.find(query).sort({ category: 1, name: 1 });
        res.json({ success: true, items });
    } catch (error) { next(error); }
};

const getItem = async (req, res, next) => {
    try {
        const item = await MenuItem.findOne({ _id: req.params.id, partner: req.user._id });
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
        res.json({ success: true, item });
    } catch (error) { next(error); }
};

const updateItem = async (req, res, next) => {
    try {
        const item = await MenuItem.findOneAndUpdate({ _id: req.params.id, partner: req.user._id }, req.body, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
        res.json({ success: true, item });
    } catch (error) { next(error); }
};

const deleteItem = async (req, res, next) => {
    try {
        const item = await MenuItem.findOneAndDelete({ _id: req.params.id, partner: req.user._id });
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
        res.json({ success: true, message: 'Item deleted' });
    } catch (error) { next(error); }
};

module.exports = { createItem, getItems, getItem, updateItem, deleteItem };