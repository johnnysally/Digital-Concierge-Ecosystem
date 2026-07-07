const Promotion = require('../../models/partner/Promotion');

const createPromotion = async (req, res, next) => {
    try {
        const promotion = await Promotion.create({ ...req.body, partner: req.user._id });
        res.status(201).json({ success: true, promotion });
    } catch (error) {
        next(error);
    }
};

const getPromotions = async (req, res, next) => {
    try {
        const { active } = req.query;
        const query = { partner: req.user._id };
        if (active !== undefined) query.isActive = active === 'true';

        const promotions = await Promotion.find(query).sort({ createdAt: -1 });
        res.json({ success: true, promotions });
    } catch (error) {
        next(error);
    }
};

const getPromotion = async (req, res, next) => {
    try {
        const promotion = await Promotion.findOne({ _id: req.params.id, partner: req.user._id });
        if (!promotion) return res.status(404).json({ success: false, message: 'Promotion not found' });
        res.json({ success: true, promotion });
    } catch (error) {
        next(error);
    }
};

const updatePromotion = async (req, res, next) => {
    try {
        const promotion = await Promotion.findOneAndUpdate(
            { _id: req.params.id, partner: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!promotion) return res.status(404).json({ success: false, message: 'Promotion not found' });
        res.json({ success: true, promotion });
    } catch (error) {
        next(error);
    }
};

const deletePromotion = async (req, res, next) => {
    try {
        const promotion = await Promotion.findOneAndDelete({ _id: req.params.id, partner: req.user._id });
        if (!promotion) return res.status(404).json({ success: false, message: 'Promotion not found' });
        res.json({ success: true, message: 'Promotion deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = { createPromotion, getPromotions, getPromotion, updatePromotion, deletePromotion };