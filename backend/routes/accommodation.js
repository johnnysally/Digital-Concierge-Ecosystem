const router = require('express').Router();
const accommodationAuth = require('../middleware/accommodation/accommodationAuth');

router.use('/auth', require('./accommodation/accommodationRoutes'));
router.use('/properties', require('./accommodation/propertyRoutes'));
router.use('/rooms', require('./accommodation/roomRoutes'));
router.use('/reservations', require('./accommodation/reservationRoutes'));
router.use('/guests', require('./accommodation/guestRoutes'));
router.use('/staff', require('./accommodation/staffRoutes'));
router.use('/promotions', require('./accommodation/promotionRoutes'));
router.use('/housekeeping', require('./accommodation/housekeepingRoutes'));
router.use('/documents', require('./accommodation/documentRoutes'));
router.use('/notifications', require('./accommodation/notificationRoutes'));
router.use('/analytics', require('./accommodation/analyticsRoutes'));
router.use('/settings', require('./accommodation/settingsRoutes'));
router.get('/wallet/payouts', accommodationAuth, async (req, res, next) => {
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