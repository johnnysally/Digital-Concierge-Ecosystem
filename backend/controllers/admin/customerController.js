const mongoose = require('mongoose');
const Customer = require('../../models/customer/Customer');
const Booking = require('../../models/customer/Booking');
const Payment = require('../../models/customer/Payment');
const Wallet = require('../../models/customer/Wallet');
const Order = require('../../models/restaurant/Order');
const Ride = require('../../models/transport/Ride');
const Review = require('../../models/customer/Review');

const { ObjectId } = mongoose.Types;

const resolveId = (id) => {
    if (ObjectId.isValid(id) && id.length === 24) return new ObjectId(id);
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
        const id = resolveId(req.params.id);
        const customer = await Customer.collection.findOne({ _id: id });
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });

        const customerIdStr = customer._id.toString();

        const [bookings, payments, wallet, orders, rides, reviews] = await Promise.all([
            Booking.collection.find({ customer: customerIdStr }).sort({ createdAt: -1 }).limit(20).toArray(),
            Payment.collection.find({ customer: customerIdStr }).sort({ createdAt: -1 }).limit(20).toArray(),
            Wallet.collection.findOne({ customer: customerIdStr }),
            Order.collection.find({ customer: customerIdStr }).sort({ createdAt: -1 }).limit(20).toArray(),
            Ride.collection.find({ customer: customerIdStr }).sort({ createdAt: -1 }).limit(20).toArray(),
            Review.collection.find({ customer: customerIdStr }).sort({ createdAt: -1 }).limit(20).toArray(),
        ]);

        res.json({
            success: true,
            customer,
            bookings,
            payments,
            wallet: wallet || { balance: 0, currency: 'KES' },
            orders,
            rides,
            reviews,
            stats: {
                totalBookings: bookings.length,
                totalOrders: orders.length,
                totalRides: rides.length,
                totalPayments: payments.length,
                totalSpent: payments.filter(p => p.type === 'payment' && p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0),
                walletBalance: wallet?.balance || 0,
            },
        });
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
        await Wallet.collection.deleteOne({ customer: customerIdStr });
        await Order.collection.deleteMany({ customer: customerIdStr });
        await Ride.collection.deleteMany({ customer: customerIdStr });
        await Review.collection.deleteMany({ customer: customerIdStr });
        res.json({ success: true, message: 'Customer and all associated data deleted' });
    } catch (error) { next(error); }
};

module.exports = { getAllCustomers, getCustomer, suspendCustomer, activateCustomer, deleteCustomer };