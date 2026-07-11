const Customer = require('../../models/customer/Customer');
const AccommodationPartner = require('../../models/accommodation/AccommodationPartner');
const RestaurantPartner = require('../../models/restaurant/RestaurantPartner');
const TransportPartner = require('../../models/transport/TransportPartner');
const Payment = require('../../models/customer/Payment');
const Booking = require('../../models/customer/Booking');
const Property = require('../../models/accommodation/Property');
const SupportTicket = require('../../models/customer/SupportTicket');
const Dispute = require('../../models/admin/Dispute');

const getDashboardStats = async (req, res, next) => {
    try {
        const [
            totalCustomers,
            accPartners, restPartners, transPartners,
            totalProperties,
            totalBookings,
            totalTickets,
            totalDisputes,
        ] = await Promise.all([
            Customer.countDocuments(),
            AccommodationPartner.countDocuments(),
            RestaurantPartner.countDocuments(),
            TransportPartner.countDocuments(),
            Property.countDocuments(),
            Booking.countDocuments(),
            SupportTicket.countDocuments(),
            Dispute.countDocuments(),
        ]);

        const totalPartners = accPartners + restPartners + transPartners;

        const revenue = await Payment.aggregate([
            { $match: { status: 'completed', type: 'payment' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        const recentBookings = await Booking.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('customer', 'firstName lastName')
            .populate('property', 'name')
            .lean();

        res.json({
            success: true,
            stats: {
                totalCustomers,
                totalPartners,
                totalProperties,
                totalBookings,
                totalRevenue: revenue[0]?.total || 0,
                totalTickets,
                totalDisputes,
                accPartners,
                restPartners,
                transPartners,
            },
            recentBookings,
        });
    } catch (error) { next(error); }
};

const getRevenueReport = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const match = { status: 'completed', type: 'payment' };
        if (startDate) match.createdAt = { $gte: new Date(startDate) };
        if (endDate) match.createdAt = { ...match.createdAt, $lte: new Date(endDate) };

        const revenue = await Payment.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.json({ success: true, revenue });
    } catch (error) { next(error); }
};

module.exports = { getDashboardStats, getRevenueReport };