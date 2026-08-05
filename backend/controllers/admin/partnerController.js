const mongoose = require('mongoose');
const AccommodationPartner = require('../../models/accommodation/AccommodationPartner');
const RestaurantPartner = require('../../models/restaurant/RestaurantPartner');
const TransportPartner = require('../../models/transport/TransportPartner');
const Property = require('../../models/accommodation/Property');
const Booking = require('../../models/customer/Booking');
const Payment = require('../../models/customer/Payment');
const Order = require('../../models/restaurant/Order');
const Ride = require('../../models/transport/Ride');
const Review = require('../../models/customer/Review');
const { partner: partnerEmails } = require('../../services/emailService');
const logger = require('../../utils/logger');

const { ObjectId } = mongoose.Types;

const resolveId = (id) => {
    if (ObjectId.isValid(id) && id.length === 24) return new ObjectId(id);
    return id;
};

const getAllPartners = async (req, res, next) => {
    try {
        const { type, active, page = 1, limit = 20 } = req.query;
        const query = {};
        if (active !== undefined) query.isActive = active === 'true';
        let partners = []; let total = 0;

        if (!type || type === 'accommodation') {
            const acc = await AccommodationPartner.collection.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit)).toArray();
            partners.push(...acc.map(p => ({ ...p, partnerType: 'accommodation' })));
            total += await AccommodationPartner.countDocuments(query);
        }
        if (!type || type === 'restaurant') {
            const rest = await RestaurantPartner.collection.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit)).toArray();
            partners.push(...rest.map(p => ({ ...p, partnerType: 'restaurant' })));
            total += await RestaurantPartner.countDocuments(query);
        }
        if (!type || type === 'transport') {
            const trans = await TransportPartner.collection.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit)).toArray();
            partners.push(...trans.map(p => ({ ...p, partnerType: 'transport' })));
            total += await TransportPartner.countDocuments(query);
        }

        res.json({ success: true, partners, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) { next(error); }
};

const getPartner = async (req, res, next) => {
    try {
        const id = resolveId(req.params.id);
        let partner = await AccommodationPartner.collection.findOne({ _id: id });
        let partnerType = 'accommodation';
        let partnerModel = AccommodationPartner;

        if (!partner) {
            partner = await RestaurantPartner.collection.findOne({ _id: id });
            partnerType = 'restaurant';
            partnerModel = RestaurantPartner;
        }
        if (!partner) {
            partner = await TransportPartner.collection.findOne({ _id: id });
            partnerType = 'transport';
            partnerModel = TransportPartner;
        }
        if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });

        const partnerIdStr = partner._id.toString();
        const partnerObjId = new ObjectId(partnerIdStr);

        const [properties, fullPartner] = await Promise.all([
            partnerType === 'accommodation' ? Property.collection.find({ partner: partnerObjId }).toArray() : Promise.resolve([]),
            partnerModel.findById(id).select('+payoutMethods').lean(),
        ]);

        const propertyIds = properties.map(p => p._id);

        const [bookings, orders, rides, payments, reviews] = await Promise.all([
            partnerType === 'accommodation' ? Booking.collection.find({ property: { $in: propertyIds } }).sort({ createdAt: -1 }).limit(20).toArray() : Promise.resolve([]),
            partnerType === 'restaurant' ? Order.collection.find({ partner: partnerObjId }).sort({ createdAt: -1 }).limit(20).toArray() : Promise.resolve([]),
            partnerType === 'transport' ? Ride.collection.find({ partner: partnerObjId }).sort({ createdAt: -1 }).limit(20).toArray() : Promise.resolve([]),
            Payment.collection.find({ customer: partnerObjId, type: { $ne: 'payout' } }).sort({ createdAt: -1 }).limit(20).toArray(),
            Review.collection.find({ $or: [{ property: { $in: propertyIds } }, { property: partnerObjId }] }).sort({ createdAt: -1 }).limit(20).toArray(),
        ]);

        let totalRevenue = 0;
        if (partnerType === 'accommodation') {
            totalRevenue = bookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + (b.totalAmount || 0), 0);
        } else if (partnerType === 'restaurant') {
            totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + (o.total || 0), 0);
        } else if (partnerType === 'transport') {
            totalRevenue = rides.filter(r => r.paymentStatus === 'paid').reduce((sum, r) => sum + (r.fare?.total || r.totalAmount || 0), 0);
        }

        const totalPayouts = payments.filter(p => p.type === 'payout' && p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0);

        res.json({
            success: true,
            partner: { ...partner, partnerType, payoutMethods: fullPartner?.payoutMethods || partner.payoutMethods || [] },
            properties,
            bookings,
            orders,
            rides,
            payments,
            reviews,
            stats: {
                totalProperties: properties.length,
                totalBookings: bookings.length,
                totalOrders: orders.length,
                totalRides: rides.length,
                totalReviews: reviews.length,
                totalRevenue,
                totalPayouts,
                netEarnings: totalRevenue - totalPayouts,
            },
        });
    } catch (error) { next(error); }
};

const approvePartner = async (req, res, next) => {
    try {
        const id = resolveId(req.params.id);
        let result = await AccommodationPartner.collection.findOneAndUpdate({ _id: id }, { $set: { isVerified: true, isActive: true } }, { returnDocument: 'after' });
        let partnerType = 'accommodation';
        if (!result) { result = await RestaurantPartner.collection.findOneAndUpdate({ _id: id }, { $set: { isVerified: true, isActive: true } }, { returnDocument: 'after' }); partnerType = 'restaurant'; }
        if (!result) { result = await TransportPartner.collection.findOneAndUpdate({ _id: id }, { $set: { isVerified: true, isActive: true } }, { returnDocument: 'after' }); partnerType = 'transport'; }
        if (!result) return res.status(404).json({ success: false, message: 'Partner not found' });

        partnerEmails.sendApproved(result).catch(e => logger.error('Approval email failed: ' + e.message));
        res.json({ success: true, partner: result, message: 'Partner approved and notified.' });
    } catch (error) { next(error); }
};

const suspendPartner = async (req, res, next) => {
    try {
        const id = resolveId(req.params.id);
        let result = await AccommodationPartner.collection.findOneAndUpdate({ _id: id }, { $set: { isActive: false } }, { returnDocument: 'after' });
        if (!result) result = await RestaurantPartner.collection.findOneAndUpdate({ _id: id }, { $set: { isActive: false } }, { returnDocument: 'after' });
        if (!result) result = await TransportPartner.collection.findOneAndUpdate({ _id: id }, { $set: { isActive: false } }, { returnDocument: 'after' });
        if (!result) return res.status(404).json({ success: false, message: 'Partner not found' });

        partnerEmails.sendAccountChanged(result, 'suspended').catch(e => logger.error('Suspension email failed: ' + e.message));
        res.json({ success: true, partner: result, message: 'Partner suspended and notified.' });
    } catch (error) { next(error); }
};

const activatePartner = async (req, res, next) => {
    try {
        const id = resolveId(req.params.id);
        let result = await AccommodationPartner.collection.findOneAndUpdate({ _id: id }, { $set: { isActive: true } }, { returnDocument: 'after' });
        if (!result) result = await RestaurantPartner.collection.findOneAndUpdate({ _id: id }, { $set: { isActive: true } }, { returnDocument: 'after' });
        if (!result) result = await TransportPartner.collection.findOneAndUpdate({ _id: id }, { $set: { isActive: true } }, { returnDocument: 'after' });
        if (!result) return res.status(404).json({ success: false, message: 'Partner not found' });

        partnerEmails.sendAccountChanged(result, 'reactivated').catch(e => logger.error('Reactivation email failed: ' + e.message));
        res.json({ success: true, partner: result, message: 'Partner reactivated and notified.' });
    } catch (error) { next(error); }
};

const deletePartner = async (req, res, next) => {
    try {
        const id = resolveId(req.params.id);
        let result = await AccommodationPartner.collection.findOneAndDelete({ _id: id });
        if (!result) result = await RestaurantPartner.collection.findOneAndDelete({ _id: id });
        if (!result) result = await TransportPartner.collection.findOneAndDelete({ _id: id });
        if (!result) return res.status(404).json({ success: false, message: 'Partner not found' });

        partnerEmails.sendAccountDeleted(result).catch(e => logger.error('Delete notification failed: ' + e.message));
        res.json({ success: true, message: 'Partner permanently deleted and notified' });
    } catch (error) { next(error); }
};

module.exports = { getAllPartners, getPartner, approvePartner, suspendPartner, activatePartner, deletePartner };