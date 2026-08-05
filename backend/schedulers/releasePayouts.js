const Payment = require('../models/customer/Payment');
const Booking = require('../models/customer/Booking');
const Order = require('../models/restaurant/Order');
const Ride = require('../models/transport/Ride');
const AccommodationPartner = require('../models/accommodation/AccommodationPartner');
const RestaurantPartner = require('../models/restaurant/RestaurantPartner');
const TransportPartner = require('../models/transport/TransportPartner');
const PlatformSettings = require('../models/admin/PlatformSettings');
const { partner: partnerEmails } = require('../services/emailService');
const logger = require('../utils/logger');

const releasePayouts = async () => {
    try {
        const now = new Date();
        const cutoffTime = new Date(now - 48 * 60 * 60 * 1000);

        const payments = await Payment.find({
            status: 'completed',
            type: 'payment',
            createdAt: { $lte: cutoffTime },
            $or: [{ 'metadata.paidOut': { $ne: true } }, { 'metadata.paidOut': { $exists: false } }],
        }).lean();

        const commissionSetting = await PlatformSettings.findOne({ key: 'commission_accommodation' });
        const commissionRate = commissionSetting?.value || 10;

        let released = 0;

        for (const p of payments) {
            let partnerId = null;
            let isCompleted = false;

            if (p.booking) {
                const booking = await Booking.findById(p.booking).select('property status').populate({ path: 'property', select: 'partner' }).lean();
                if (booking?.property?.partner && booking.status === 'completed') {
                    partnerId = booking.property.partner;
                    isCompleted = true;
                }
            }

            if (!partnerId && p.metadata?.orderId) {
                const order = await Order.findById(p.metadata.orderId).select('partner status').lean();
                if (order?.partner && order.status === 'completed') {
                    partnerId = order.partner;
                    isCompleted = true;
                }
            }

            if (!partnerId && p.metadata?.rideId) {
                const ride = await Ride.findById(p.metadata.rideId).select('partner status').lean();
                if (ride?.partner && ride.status === 'completed') {
                    partnerId = ride.partner;
                    isCompleted = true;
                }
            }

            if (!partnerId || !isCompleted) continue;

            const commission = (p.amount * commissionRate) / 100;
            const netAmount = p.amount - commission;

            let partner = await AccommodationPartner.findById(partnerId).select('businessName email').lean();
            if (!partner) partner = await RestaurantPartner.findById(partnerId).select('businessName email').lean();
            if (!partner) partner = await TransportPartner.findById(partnerId).select('businessName email').lean();
            if (!partner) continue;

            const reference = 'AUTO-' + Date.now();

            await Payment.create({
                customer: partnerId,
                amount: netAmount,
                method: 'bank_transfer',
                type: 'payout',
                status: 'completed',
                reference,
                transactionId: reference,
            });

            await Payment.updateMany(
                { _id: p._id },
                { $set: { 'metadata.paidOut': true } }
            );

            partnerEmails.sendPayout(partner, {
                amount: netAmount,
                method: 'Auto Release (48h)',
                reference,
            }).catch(e => logger.error('Auto payout email failed: ' + e.message));

            released++;
            logger.info(`Auto payout: ${partner.businessName} - KES ${netAmount}`);
        }

        logger.info(`Payout release: ${released} partners processed`);
        return { released };
    } catch (error) {
        logger.error(`Payout release failed: ${error.message}`);
        throw error;
    }
};

module.exports = releasePayouts;