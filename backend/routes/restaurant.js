const router = require('express').Router();
const promotionController = require('../controllers/restaurant/promotionController');
const restaurantAuth = require('../middleware/restaurant/restaurantAuth');

router.use('/auth', require('./restaurant/restaurantRoutes'));
router.use('/menu', require('./restaurant/menuRoutes'));
router.use('/orders', require('./restaurant/orderRoutes'));
router.use('/staff', require('./restaurant/staffRoutes'));
router.use('/promotions', require('./restaurant/promotionRoutes'));
router.use('/notifications', require('./restaurant/notificationRoutes'));
router.get('/reviews', restaurantAuth, promotionController.getReviews);
router.get('/wallet/payouts', restaurantAuth, async (req, res, next) => {
    try {
        const Payment = require('../models/customer/Payment');
        const mongoose = require('mongoose');
        const partnerId = new mongoose.Types.ObjectId(req.user._id);
        const { status, page = 1, limit = 20 } = req.query;
        const query = { customer: partnerId, type: 'payout' };
        if (status) query.status = status;
        const payouts = await Payment.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
        const total = await Payment.countDocuments(query);
        const totalPayouts = await Payment.aggregate([
            { $match: { customer: partnerId, type: 'payout', status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        res.json({ success: true, payouts, total, totalAmount: totalPayouts[0]?.total || 0, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) { next(error); }
});

module.exports = router;