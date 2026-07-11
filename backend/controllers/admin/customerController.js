const mongoose = require('mongoose');
const Customer = require('../../models/customer/Customer');
const Booking = require('../../models/customer/Booking');
const Payment = require('../../models/customer/Payment');

const { ObjectId } = mongoose.Types;

const resolveId = (id) => {
    if (ObjectId.isValid(id) && id.length === 24) {
        return new ObjectId(id);
    }
    return id;
};

const getAllCustomers = async (req, res, next) => {
    try {
        const { active, page = 1, limit = 20 } = req.query;
        const query = {};
        if (active !== undefined) query.isActive = active === 'true';
        const total = await Customer.countDocuments(query);
        const customers = await Customer.collection.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .toArray();
        res.json({ success: true, customers, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) { next(error); }
};

const getCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.collection.findOne({ _id: resolveId(req.params.id) });
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
        const customerIdStr = customer._id.toString();
        const bookings = await Booking.collection.find({ customer: customerIdStr }).toArray();
        const payments = await Payment.collection.find({ customer: customerIdStr }).toArray();
        res.json({ success: true, customer, bookings, payments });
    } catch (error) { next(error); }
};

const suspendCustomer = async (req, res, next) => {
    try {
        const result = await Customer.collection.findOneAndUpdate(
            { _id: resolveId(req.params.id) },
            { $set: { isActive: false } },
            { returnDocument: 'after' }
        );
        if (!result) return res.status(404).json({ success: false, message: 'Customer not found' });
        res.json({ success: true, customer: result });
    } catch (error) { next(error); }
};

const activateCustomer = async (req, res, next) => {
    try {
        const result = await Customer.collection.findOneAndUpdate(
            { _id: resolveId(req.params.id) },
            { $set: { isActive: true } },
            { returnDocument: 'after' }
        );
        if (!result) return res.status(404).json({ success: false, message: 'Customer not found' });
        res.json({ success: true, customer: result });
    } catch (error) { next(error); }
};

const deleteCustomer = async (req, res, next) => {
    try {
        const id = resolveId(req.params.id);
        const result = await Customer.collection.findOneAndDelete({ _id: id });
        if (!result) return res.status(404).json({ success: false, message: 'Customer not found' });
        const customerIdStr = result._id.toString();
        await Booking.collection.deleteMany({ customer: customerIdStr });
        await Payment.collection.deleteMany({ customer: customerIdStr });
        res.json({ success: true, message: 'Customer and associated data deleted' });
    } catch (error) { next(error); }
};

module.exports = { getAllCustomers, getCustomer, suspendCustomer, activateCustomer, deleteCustomer };