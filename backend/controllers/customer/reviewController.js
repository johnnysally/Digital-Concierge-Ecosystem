const Review = require('../../models/customer/Review');

const createReview = async (req, res, next) => {
    try {
        const { bookingId, propertyId, rating, comment } = req.body;

        const existing = await Review.findOne({ booking: bookingId, customer: req.user._id });
        if (existing) return res.status(400).json({ success: false, message: 'Review already submitted' });

        const review = await Review.create({
            customer: req.user._id,
            property: propertyId,
            booking: bookingId,
            rating,
            comment,
        });

        res.status(201).json({ success: true, review });
    } catch (error) {
        next(error);
    }
};

const getPropertyReviews = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const reviews = await Review.find({ property: req.params.propertyId, isPublished: true })
            .populate('customer', 'firstName lastName avatar')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Review.countDocuments({ property: req.params.propertyId, isPublished: true });

        res.json({ success: true, reviews, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        next(error);
    }
};

const getMyReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ customer: req.user._id })
            .populate('property', 'name')
            .sort({ createdAt: -1 });

        res.json({ success: true, reviews });
    } catch (error) {
        next(error);
    }
};

module.exports = { createReview, getPropertyReviews, getMyReviews };