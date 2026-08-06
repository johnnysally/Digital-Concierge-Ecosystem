const router = require('express').Router();
const transportAuth = require('../middleware/transport/transportAuth');
const logger = require('../utils/logger');

router.use('/auth', require('./transport/transportRoutes'));
router.use('/vehicles', require('./transport/vehicleRoutes'));
router.use('/drivers', require('./transport/driverRoutes'));
router.use('/rides', require('./transport/rideRoutes'));
router.use('/pricing', require('./transport/pricingRoutes'));
router.use('/map', require('./transport/mapRoutes'));
router.use('/promotions', require('./transport/promotionRoutes'));
router.use('/settings', require('./transport/settingsRoutes'));
router.use('/notifications', require('./transport/notificationRoutes'));
router.use('/support', require('./transport/supportRoutes'));

router.get('/payments', transportAuth, async (req, res, next) => {
    try {
        const Ride = require('../models/transport/Ride');
        const { page = 1, limit = 20 } = req.query;
        const rides = await Ride.find({ partner: req.user._id })
            .populate('customer', 'firstName lastName')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const total = await Ride.countDocuments({ partner: req.user._id });
        const revenue = await Ride.aggregate([
            { $match: { partner: req.user._id, paymentStatus: 'paid', status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$fare.total' } } },
        ]);

        const payments = rides.map(r => ({
            _id: r._id,
            reference: `Ride #${r._id.toString().slice(-8)}`,
            amount: r.fare?.total || 0,
            method: 'customer_payment',
            type: 'ride',
            status: r.status,
            createdAt: r.createdAt,
            customerName: r.customer?.firstName + ' ' + r.customer?.lastName,
        }));

        res.json({
            success: true,
            payments,
            total,
            totalRevenue: revenue[0]?.total || 0,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
        });
    } catch (error) { next(error); }
});

router.get('/wallet/payouts', transportAuth, async (req, res, next) => {
    try {
        const Payment = require('../models/customer/Payment');
        const mongoose = require('mongoose');
        const partnerId = new mongoose.Types.ObjectId(req.user._id);
        const { status, page = 1, limit = 20 } = req.query;
        const query = { customer: partnerId, type: 'payout' };
        if (status) query.status = status;
        const payouts = await Payment.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const total = await Payment.countDocuments(query);
        const totalPayouts = await Payment.aggregate([
            { $match: { customer: partnerId, type: 'payout', status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        res.json({
            success: true,
            payouts,
            total,
            totalAmount: totalPayouts[0]?.total || 0,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
        });
    } catch (error) { next(error); }
});

module.exports = router;