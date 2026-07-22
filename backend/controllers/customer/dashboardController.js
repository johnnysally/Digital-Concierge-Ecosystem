const Booking = require('../../models/customer/Booking');
const Payment = require('../../models/customer/Payment');
const Wallet = require('../../models/customer/Wallet');
const Property = require('../../models/accommodation/Property');

const getDashboard = async (req, res, next) => {
    try {
        const [bookings, payments, wallet, properties] = await Promise.all([
            Booking.find({ customer: req.user._id }).sort({ createdAt: -1 }).limit(5).populate('property', 'name').lean(),
            Payment.find({ customer: req.user._id }).sort({ createdAt: -1 }).limit(5).lean(),
            Wallet.findOne({ customer: req.user._id }).lean(),
            Property.find({ published: true }).limit(4).lean(),
        ]);

        const stats = {
            trips: bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length,
            points: wallet?.rewardsPoints || 0,
            recommendations: properties.length,
        };

        const recentActivity = [
            ...bookings.map(b => ({
                icon: '📅',
                title: `Booking at ${b.property?.name || 'Property'}`,
                time: new Date(b.createdAt).toLocaleDateString(),
                status: b.status,
            })),
            ...payments.map(p => ({
                icon: '💳',
                title: `${p.type} - ${p.method}`,
                time: new Date(p.createdAt).toLocaleDateString(),
                amount: p.amount,
            })),
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

        res.json({
            success: true,
            stats,
            recentActivity,
            recommendations: properties.map(p => ({
                _id: p._id,
                name: p.name,
                type: p.type,
                city: p.address?.city,
                rating: p.rating,
            })),
        });
    } catch (error) { next(error); }
};

module.exports = { getDashboard };