const Review = require('../../models/customer/Review');
const Booking = require('../../models/customer/Booking');
const Property = require('../../models/accommodation/Property');
const AccommodationPartner = require('../../models/accommodation/AccommodationPartner');
const { partner: partnerEmails, customer: customerEmails } = require('../../services/emailService');
const { createNotification } = require('../../services/notificationService');
const logger = require('../../utils/logger');

const createReview = async (req, res, next) => {
    try {
        const { bookingId, propertyId, rating, comment, reviewType, itemName } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
        }
        if (!propertyId) {
            return res.status(400).json({ success: false, message: 'Property ID is required.' });
        }

        const review = await Review.create({
            customer: req.user._id,
            property: propertyId,
            booking: bookingId || null,
            rating,
            comment: comment || '',
        });

        const property = await Property.findById(propertyId);
        const displayName = itemName || property?.name || 'Business';

        if (property) {
            const totalReviews = await Review.countDocuments({ property: propertyId });
            const avgRating = await Review.aggregate([
                { $match: { property: property._id } },
                { $group: { _id: null, avg: { $avg: '$rating' } } },
            ]);
            property.rating = Math.round((avgRating[0]?.avg || rating) * 10) / 10;
            property.reviewCount = totalReviews;
            await property.save();

            const partner = await AccommodationPartner.findById(property.partner);
            if (partner) {
                partnerEmails.sendNewReview(partner, {
                    propertyName: displayName,
                    guestName: req.user.firstName + ' ' + req.user.lastName,
                    rating,
                    comment: comment || 'No comment',
                }).catch(e => logger.error('Review notification failed: ' + e.message));

                createNotification({
                    partnerId: partner._id.toString(),
                    type: 'review',
                    title: 'New Review Received',
                    message: req.user.firstName + ' left a ' + rating + '-star review for ' + displayName + '.',
                }).catch(e => logger.error('Partner notification failed: ' + e.message));
            }
        }

        if (reviewType === 'restaurant') {
            customerEmails.sendRestaurantReviewRequest(req.user, {
                restaurantName: displayName,
                id: review._id,
                restaurantId: propertyId,
            }).catch(e => logger.error('Review email failed: ' + e.message));
        } else if (reviewType === 'transport') {
            customerEmails.sendTransportReviewRequest(req.user, {
                vehicleName: displayName,
                id: review._id,
                vehicleId: propertyId,
            }).catch(e => logger.error('Review email failed: ' + e.message));
        } else {
            customerEmails.sendReviewRequest(req.user, {
                propertyName: displayName,
                id: bookingId || review._id,
            }).catch(e => logger.error('Review email failed: ' + e.message));
        }

        createNotification({
            customerId: req.user._id.toString(),
            type: 'review',
            title: 'Review Submitted',
            message: 'Your ' + rating + '-star review for ' + displayName + ' has been posted.',
        }).catch(e => logger.error('Notification failed: ' + e.message));

        res.status(201).json({ success: true, review });
    } catch (error) { next(error); }
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
    } catch (error) { next(error); }
};

const getMyReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ customer: req.user._id })
            .populate('property', 'name')
            .sort({ createdAt: -1 });
        res.json({ success: true, reviews });
    } catch (error) { next(error); }
};

const updateReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const review = await Review.findOneAndUpdate(
            { _id: req.params.id, customer: req.user._id },
            { rating, comment },
            { new: true, runValidators: true }
        );
        if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
        res.json({ success: true, review });
    } catch (error) { next(error); }
};

const deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findOneAndDelete({ _id: req.params.id, customer: req.user._id });
        if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
        res.json({ success: true, message: 'Review deleted.' });
    } catch (error) { next(error); }
};

module.exports = { createReview, getPropertyReviews, getMyReviews, updateReview, deleteReview };