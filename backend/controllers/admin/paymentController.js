const Payment = require('../../models/customer/Payment');
const Booking = require('../../models/customer/Booking');
const AccommodationPartner = require('../../models/accommodation/AccommodationPartner');
const RestaurantPartner = require('../../models/restaurant/RestaurantPartner');
const TransportPartner = require('../../models/transport/TransportPartner');
const PlatformSettings = require('../../models/admin/PlatformSettings');
const { partner: partnerEmails } = require('../../services/emailService');
const logger = require('../../utils/logger');

const getAllPayments = async (req, res, next) => {
    try {
        const { status, method, type, page = 1, limit = 20 } = req.query;
        const query = { type: { $ne: 'payout' } };
        if (status) query.status = status;
        if (method) query.method = method;
        if (type) query.type = type;

        const payments = await Payment.find(query)
            .populate('customer', 'firstName lastName email')
            .populate({ path: 'booking', populate: { path: 'property', select: 'name partner' } })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();

        const enriched = await Promise.all(payments.map(async (p) => {
            let partnerName = 'N/A';
            let partnerType = 'N/A';

            if (p.booking?.property?.partner) {
                const pid = p.booking.property.partner;
                const acc = await AccommodationPartner.findById(pid).select('businessName').lean();
                if (acc) { partnerName = acc.businessName; partnerType = 'accommodation'; }
                if (!acc) {
                    const rest = await RestaurantPartner.findById(pid).select('businessName').lean();
                    if (rest) { partnerName = rest.businessName; partnerType = 'restaurant'; }
                }
                if (!acc) {
                    const trans = await TransportPartner.findById(pid).select('businessName').lean();
                    if (trans) { partnerName = trans.businessName; partnerType = 'transport'; }
                }
            }

            if (partnerName === 'N/A' && p.metadata?.orderData?.items?.length > 0) {
                const MenuItem = require('../../models/restaurant/MenuItem');
                const firstItem = await MenuItem.findById(p.metadata.orderData.items[0]?.menuItem).select('partner').lean();
                if (firstItem?.partner) {
                    const rest = await RestaurantPartner.findById(firstItem.partner).select('businessName').lean();
                    if (rest) { partnerName = rest.businessName; partnerType = 'restaurant'; }
                }
            }

            if (partnerName === 'N/A' && p.metadata?.rideData?.vehicleId) {
                const Vehicle = require('../../models/transport/Vehicle');
                const vehicle = await Vehicle.findById(p.metadata.rideData.vehicleId).select('partner').lean();
                if (vehicle?.partner) {
                    const trans = await TransportPartner.findById(vehicle.partner).select('businessName').lean();
                    if (trans) { partnerName = trans.businessName; partnerType = 'transport'; }
                }
            }

            return { ...p, partnerName, partnerType, paidOut: p.metadata?.paidOut || false };
        }));

        const total = await Payment.countDocuments(query);
        const revenue = await Payment.aggregate([
            { $match: { status: 'completed', type: 'payment' } },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        ]);

        res.json({
            success: true, payments: enriched, total, page: parseInt(page), pages: Math.ceil(total / limit),
            totalRevenue: revenue[0]?.total || 0, totalTransactions: revenue[0]?.count || 0,
        });
    } catch (error) { next(error); }
};

const getPayment = async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('customer', 'firstName lastName email phone')
            .populate({ path: 'booking', populate: { path: 'property', select: 'name partner' } })
            .lean();
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

        let partnerName = 'N/A'; let partnerType = 'N/A';
        if (payment.booking?.property?.partner) {
            const pid = payment.booking.property.partner;
            const acc = await AccommodationPartner.findById(pid).select('businessName').lean();
            if (acc) { partnerName = acc.businessName; partnerType = 'accommodation'; }
            const rest = await RestaurantPartner.findById(pid).select('businessName').lean();
            if (rest) { partnerName = rest.businessName; partnerType = 'restaurant'; }
            const trans = await TransportPartner.findById(pid).select('businessName').lean();
            if (trans) { partnerName = trans.businessName; partnerType = 'transport'; }
        }
        if (partnerName === 'N/A' && payment.metadata?.orderData?.items?.length > 0) {
            const MenuItem = require('../../models/restaurant/MenuItem');
            const firstItem = await MenuItem.findById(payment.metadata.orderData.items[0]?.menuItem).select('partner').lean();
            if (firstItem?.partner) {
                const rest = await RestaurantPartner.findById(firstItem.partner).select('businessName').lean();
                if (rest) { partnerName = rest.businessName; partnerType = 'restaurant'; }
            }
        }
        if (partnerName === 'N/A' && payment.metadata?.rideData?.vehicleId) {
            const Vehicle = require('../../models/transport/Vehicle');
            const vehicle = await Vehicle.findById(payment.metadata.rideData.vehicleId).select('partner').lean();
            if (vehicle?.partner) {
                const trans = await TransportPartner.findById(vehicle.partner).select('businessName').lean();
                if (trans) { partnerName = trans.businessName; partnerType = 'transport'; }
            }
        }

        res.json({ success: true, payment: { ...payment, partnerName, partnerType } });
    } catch (error) { next(error); }
};

const refundPayment = async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
        if (payment.status === 'refunded') return res.status(400).json({ success: false, message: 'Already refunded' });
        payment.status = 'refunded'; payment.type = 'refund';
        await payment.save();
        if (payment.booking) await Booking.findByIdAndUpdate(payment.booking, { paymentStatus: 'refunded', status: 'cancelled' });
        res.json({ success: true, payment, message: 'Payment refunded' });
    } catch (error) { next(error); }
};

const getPayouts = async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const [accCommission, restCommission, transCommission] = await Promise.all([
            PlatformSettings.findOne({ key: 'commission_accommodation' }),
            PlatformSettings.findOne({ key: 'commission_restaurant' }),
            PlatformSettings.findOne({ key: 'commission_transport' }),
        ]);

        const commissionRates = {
            accommodation: accCommission?.value || 10,
            restaurant: restCommission?.value || 15,
            transport: transCommission?.value || 12,
        };

        // Only get unpaid payments
        const payments = await Payment.find({
            status: 'completed',
            type: 'payment',
            $or: [{ 'metadata.paidOut': { $ne: true } }, { 'metadata.paidOut': { $exists: false } }],
        }).lean();

        const releasedPayouts = await Payment.find({ type: 'payout' }).lean();
        const releasedPartnerIds = new Set(releasedPayouts.map(p => p.customer?.toString()).filter(Boolean));

        const partnerPayments = {};
        const partnerTypes = {};
        const paymentDetails = {};

        for (const p of payments) {
            let pid = null;
            let ptype = 'accommodation';

            if (p.booking) {
                const booking = await Booking.findById(p.booking).select('property').populate({ path: 'property', select: 'partner' }).lean();
                if (booking?.property?.partner) { pid = booking.property.partner.toString(); ptype = 'accommodation'; }
            }
            if (!pid && p.metadata?.orderData?.items?.length > 0) {
                const MenuItem = require('../../models/restaurant/MenuItem');
                const firstItem = await MenuItem.findById(p.metadata.orderData.items[0]?.menuItem).select('partner').lean();
                if (firstItem?.partner) { pid = firstItem.partner.toString(); ptype = 'restaurant'; }
            }
            if (!pid && p.metadata?.rideData?.vehicleId) {
                const Vehicle = require('../../models/transport/Vehicle');
                const vehicle = await Vehicle.findById(p.metadata.rideData.vehicleId).select('partner').lean();
                if (vehicle?.partner) { pid = vehicle.partner.toString(); ptype = 'transport'; }
            }

            if (!pid) continue;

            partnerTypes[pid] = ptype;

            if (!partnerPayments[pid]) {
                partnerPayments[pid] = { totalCollected: 0, commission: 0, netPayable: 0, released: releasedPartnerIds.has(pid) };
                paymentDetails[pid] = [];
            }

            const rate = commissionRates[ptype] || 10;
            const commission = (p.amount * rate) / 100;
            partnerPayments[pid].totalCollected += p.amount;
            partnerPayments[pid].commission += commission;
            partnerPayments[pid].netPayable += p.amount - commission;
            paymentDetails[pid].push(p._id);
        }

        let payouts = Object.entries(partnerPayments).map(([partnerId, data]) => ({
            partnerId,
            partnerType: partnerTypes[partnerId] || 'accommodation',
            paymentIds: paymentDetails[partnerId] || [],
            ...data,
        }));

        for (const payout of payouts) {
            const acc = await AccommodationPartner.findById(payout.partnerId).select('businessName email firstName payoutMethods').lean();
            if (acc) { payout.partnerName = acc.businessName; payout.partnerEmail = acc.email; payout.partnerFirstName = acc.firstName; payout.payoutMethods = acc.payoutMethods || []; payout.partnerType = 'accommodation'; continue; }
            const rest = await RestaurantPartner.findById(payout.partnerId).select('businessName email firstName payoutMethods').lean();
            if (rest) { payout.partnerName = rest.businessName; payout.partnerEmail = rest.email; payout.partnerFirstName = rest.firstName; payout.payoutMethods = rest.payoutMethods || []; payout.partnerType = 'restaurant'; continue; }
            const trans = await TransportPartner.findById(payout.partnerId).select('businessName email firstName payoutMethods').lean();
            if (trans) { payout.partnerName = trans.businessName; payout.partnerEmail = trans.email; payout.partnerFirstName = trans.firstName; payout.payoutMethods = trans.payoutMethods || []; payout.partnerType = 'transport'; }
        }

        payouts.sort((a, b) => (a.partnerName || '').localeCompare(b.partnerName || ''));
        const total = payouts.length;
        const paginated = payouts.slice((page - 1) * limit, page * limit);

        res.json({ success: true, payouts: paginated, total, page: parseInt(page), pages: Math.ceil(total / limit), commissionRates });
    } catch (error) { next(error); }
};

const releasePayout = async (req, res, next) => {
    try {
        const { partnerId, amount, method, accountNumber, accountName, bankName, paymentIds } = req.body;

        let partner = await AccommodationPartner.findById(partnerId).select('businessName email firstName').lean();
        let partnerType = 'accommodation';
        if (!partner) { partner = await RestaurantPartner.findById(partnerId).select('businessName email firstName').lean(); partnerType = 'restaurant'; }
        if (!partner) { partner = await TransportPartner.findById(partnerId).select('businessName email firstName').lean(); partnerType = 'transport'; }
        if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });

        const reference = 'PO-' + Date.now();

        await Payment.create({
            customer: partnerId,
            amount,
            method: method || 'bank_transfer',
            type: 'payout',
            status: 'completed',
            reference,
            transactionId: reference,
            metadata: { accountNumber: accountNumber || '', accountName: accountName || '', bankName: bankName || '' },
        });

        // Mark all included payments as paid out
        if (paymentIds && paymentIds.length > 0) {
            await Payment.updateMany(
                { _id: { $in: paymentIds } },
                { $set: { 'metadata.paidOut': true } }
            );
        }

        const methodLabels = {
            mpesa_send: 'M-Pesa Send Money', mpesa_till: 'M-Pesa Till Number',
            mpesa_paybill: 'M-Pesa Paybill', bank: 'Bank Transfer', cash: 'Cash',
        };

        partnerEmails.sendPayout(partner, {
            amount,
            method: methodLabels[method] || method || 'Bank Transfer',
            reference,
        }).catch(e => logger.error('Payout email failed: ' + e.message));

        res.json({ success: true, message: 'Payout of KES ' + amount.toLocaleString() + ' released to ' + partner.businessName });
    } catch (error) { next(error); }
};

const getCommissionRates = async (req, res, next) => {
    try {
        const settings = await PlatformSettings.find({
            key: { $in: ['commission_accommodation', 'commission_restaurant', 'commission_transport'] },
        });
        const rates = {};
        settings.forEach(s => { rates[s.key.replace('commission_', '')] = s.value; });
        res.json({ success: true, rates });
    } catch (error) { next(error); }
};

const updateCommissionRate = async (req, res, next) => {
    try {
        const { type } = req.params;
        const { percentage } = req.body;
        await PlatformSettings.findOneAndUpdate(
            { key: 'commission_' + type },
            { value: percentage, updatedBy: req.user._id },
            { upsert: true }
        );
        res.json({ success: true, message: 'Commission for ' + type + ' updated to ' + percentage + '%' });
    } catch (error) { next(error); }
};

module.exports = { getAllPayments, getPayment, refundPayment, getPayouts, releasePayout, getCommissionRates, updateCommissionRate };