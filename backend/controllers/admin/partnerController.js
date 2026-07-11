const mongoose = require('mongoose');
const AccommodationPartner = require('../../models/accommodation/AccommodationPartner');
const RestaurantPartner = require('../../models/restaurant/RestaurantPartner');
const TransportPartner = require('../../models/transport/TransportPartner');
const Property = require('../../models/accommodation/Property');
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
        let partner = await AccommodationPartner.collection.findOne({ _id: id }); let partnerType = 'accommodation';
        if (!partner) { partner = await RestaurantPartner.collection.findOne({ _id: id }); partnerType = 'restaurant'; }
        if (!partner) { partner = await TransportPartner.collection.findOne({ _id: id }); partnerType = 'transport'; }
        if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
        const properties = partnerType === 'accommodation' ? await Property.collection.find({ partner: req.params.id }).toArray() : [];
        res.json({ success: true, partner: { ...partner, partnerType }, properties });
    } catch (error) { next(error); }
};

const approvePartner = async (req, res, next) => {
    try {
        const id = resolveId(req.params.id);
        let result = await AccommodationPartner.collection.findOneAndUpdate({ _id: id }, { $set: { isVerified: true, isActive: true } }, { returnDocument: 'after' });
        if (!result) result = await RestaurantPartner.collection.findOneAndUpdate({ _id: id }, { $set: { isVerified: true, isActive: true } }, { returnDocument: 'after' });
        if (!result) result = await TransportPartner.collection.findOneAndUpdate({ _id: id }, { $set: { isVerified: true, isActive: true } }, { returnDocument: 'after' });
        if (!result) return res.status(404).json({ success: false, message: 'Partner not found' });
        partnerEmails.sendApproved(result).catch(e => logger.error(`Approval email failed: ${e.message}`));
        res.json({ success: true, partner: result, message: 'Partner approved and notified' });
    } catch (error) { next(error); }
};

const suspendPartner = async (req, res, next) => {
    try {
        const id = resolveId(req.params.id);
        let result = await AccommodationPartner.collection.findOneAndUpdate({ _id: id }, { $set: { isActive: false } }, { returnDocument: 'after' });
        if (!result) result = await RestaurantPartner.collection.findOneAndUpdate({ _id: id }, { $set: { isActive: false } }, { returnDocument: 'after' });
        if (!result) result = await TransportPartner.collection.findOneAndUpdate({ _id: id }, { $set: { isActive: false } }, { returnDocument: 'after' });
        if (!result) return res.status(404).json({ success: false, message: 'Partner not found' });
        res.json({ success: true, partner: result });
    } catch (error) { next(error); }
};

const activatePartner = async (req, res, next) => {
    try {
        const id = resolveId(req.params.id);
        let result = await AccommodationPartner.collection.findOneAndUpdate({ _id: id }, { $set: { isActive: true } }, { returnDocument: 'after' });
        if (!result) result = await RestaurantPartner.collection.findOneAndUpdate({ _id: id }, { $set: { isActive: true } }, { returnDocument: 'after' });
        if (!result) result = await TransportPartner.collection.findOneAndUpdate({ _id: id }, { $set: { isActive: true } }, { returnDocument: 'after' });
        if (!result) return res.status(404).json({ success: false, message: 'Partner not found' });
        res.json({ success: true, partner: result });
    } catch (error) { next(error); }
};

const deletePartner = async (req, res, next) => {
    try {
        const id = resolveId(req.params.id);
        let result = await AccommodationPartner.collection.findOneAndDelete({ _id: id });
        if (!result) result = await RestaurantPartner.collection.findOneAndDelete({ _id: id });
        if (!result) result = await TransportPartner.collection.findOneAndDelete({ _id: id });
        if (!result) return res.status(404).json({ success: false, message: 'Partner not found' });
        res.json({ success: true, message: 'Partner deleted' });
    } catch (error) { next(error); }
};

module.exports = { getAllPartners, getPartner, approvePartner, suspendPartner, activatePartner, deletePartner };