const router = require('express').Router();
const promotionController = require('../controllers/transport/promotionController');
const transportAuth = require('../middleware/transport/transportAuth');

router.use('/auth', require('./transport/transportRoutes'));
router.use('/vehicles', require('./transport/vehicleRoutes'));
router.use('/rides', require('./transport/rideRoutes'));
router.use('/drivers', require('./transport/driverRoutes'));
router.use('/promotions', require('./transport/promotionRoutes'));
router.use('/map', require('./transport/mapRoutes'));
router.use('/settings', require('./transport/settingsRoutes'));
router.use('/support', require('./transport/supportRoutes'));
router.use('/notifications', require('./transport/notificationRoutes'));
router.get('/reviews', transportAuth, promotionController.getReviews);
router.use('/destination-prices', require('./transport/destinationPriceRoutes'));
router.get('/wallet/payouts', transportAuth, async (req, res, next) => {
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