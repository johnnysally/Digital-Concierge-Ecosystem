const Payment = require('../models/customer/Payment');
const Booking = require('../models/customer/Booking');
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
        }).populate({ path: 'booking', populate: { path: 'property', select: 'partner' } }).lean();

        const partnerPayments = {};
        for (const p of payments) {
            if (!p.booking?.property?.partner) continue;
            const pid = p.booking.property.partner.toString();
            if (!partnerPayments[pid]) partnerPayments[pid] = { partnerId: pid, total: 0, count: 0 };
            partnerPayments[pid].total += p.amount;
            partnerPayments[pid].count++;
        }

        const commissionSetting = await PlatformSettings.findOne({ key: 'commission_accommodation' });
        const commissionRate = commissionSetting?.value || 10;

        let released = 0;
        for (const [partnerId, data] of Object.entries(partnerPayments)) {
            const commission = (data.total * commissionRate) / 100;
            const netAmount = data.total - commission;

            let partner = await AccommodationPartner.findById(partnerId).select('businessName email').lean();
            if (!partner) partner = await RestaurantPartner.findById(partnerId).select('businessName email').lean();
            if (!partner) partner = await TransportPartner.findById(partnerId).select('businessName email').lean();
            if (!partner) continue;

            partnerEmails.sendPayout(partner, {
                amount: netAmount,
                method: 'Auto Release (48h)',
                reference: `AUTO-${Date.now()}`,
            }).catch(e => logger.error(`Auto payout email failed: ${e.message}`));

            released++;
            logger.info(`Auto payout: ${partner.businessName} - KES ${netAmount} (${data.count} bookings, ${commissionRate}% commission)`);
        }

        logger.info(`Payout release: ${released} partners processed`);
        return { released };
    } catch (error) {
        logger.error(`Payout release failed: ${error.message}`);
        throw error;
    }
};

module.exports = releasePayouts;