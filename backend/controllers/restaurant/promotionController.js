const Promotion = require('../../models/restaurant/Promotion');
const { partner: partnerEmails } = require('../../services/emailService');
const logger = require('../../utils/logger');

const createPromotion = async (req, res, next) => {
    try {
        const promotion = await Promotion.create({ ...req.body, partner: req.user._id });
        partnerEmails.sendPromotionCreated(req.user, { code: promotion.code, discount: `${promotion.discountType === 'percentage' ? promotion.discountValue + '%' : '$' + promotion.discountValue}`, expiry: promotion.expiryDate }).catch(e => logger.error(`Promotion email failed: ${e.message}`));
        res.status(201).json({ success: true, promotion });
    } catch (error) { next(error); }
};

const getPromotions = async (req, res, next) => {
    try {
        const { active } = req.query; const query = { partner: req.user._id };
        if (active !== undefined) query.isActive = active === 'true';
        res.json({ success: true, promotions: await Promotion.find(query).sort({ createdAt: -1 }) });
    } catch (error) { next(error); }
};

const getPromotion = async (req, res, next) => {
    try {
        const promo = await Promotion.findOne({ _id: req.params.id, partner: req.user._id });
        if (!promo) return res.status(404).json({ success: false, message: 'Promotion not found' });
        res.json({ success: true, promotion: promo });
    } catch (error) { next(error); }
};

const updatePromotion = async (req, res, next) => {
    try {
        const promo = await Promotion.findOneAndUpdate({ _id: req.params.id, partner: req.user._id }, req.body, { new: true, runValidators: true });
        if (!promo) return res.status(404).json({ success: false, message: 'Promotion not found' });
        res.json({ success: true, promotion: promo });
    } catch (error) { next(error); }
};

const deletePromotion = async (req, res, next) => {
    try {
        const promo = await Promotion.findOneAndDelete({ _id: req.params.id, partner: req.user._id });
        if (!promo) return res.status(404).json({ success: false, message: 'Promotion not found' });
        res.json({ success: true, message: 'Promotion deleted' });
    } catch (error) { next(error); }
};

const getReviews = async (req, res, next) => {
    try {
        const Review = require('../../models/customer/Review');
        const MenuItem = require('../../models/restaurant/MenuItem');
        
        const menuItems = await MenuItem.find({ partner: req.user._id }).select('_id');
        const menuIds = menuItems.map(m => m._id);
        
        const reviews = await Review.find({
            $or: [
                { property: { $in: menuIds } },
                { property: req.user._id },
            ],
        })
        .populate('customer', 'firstName lastName')
        .sort({ createdAt: -1 }).limit(20);
        
        res.json({ success: true, reviews });
    } catch (error) { next(error); }
};

module.exports = { createPromotion, getPromotions, getPromotion, updatePromotion, deletePromotion, getReviews };

