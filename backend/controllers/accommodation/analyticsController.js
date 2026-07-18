const Reservation = require('../../models/accommodation/Reservation');
const Property = require('../../models/accommodation/Property');

const getAccommodationAnalytics = async (req, res, next) => {
    try {
        const partnerId = req.user._id;
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        const reservations = await Reservation.find({ partner: partnerId })
            .sort({ createdAt: -1 })
            .lean();

        const properties = await Property.find({ partner: partnerId }).lean();

        const statusCounts = reservations.reduce((acc, reservation) => {
            const status = reservation.status || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        const monthlyMetrics = Array.from({ length: 6 }, (_, index) => {
            const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            return {
                key,
                month: date.toLocaleString('en', { month: 'short' }),
                revenue: 0,
                reservations: 0,
                properties: 0,
                occupancy: 0,
            };
        });

        reservations.forEach((reservation) => {
            const createdAt = reservation.createdAt ? new Date(reservation.createdAt) : null;
            if (!createdAt || createdAt < sixMonthsAgo) return;
            const key = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
            const existing = monthlyMetrics.find((item) => item.key === key);
            if (existing) {
                existing.revenue += Number(reservation.totalAmount || 0);
                existing.reservations += 1;
                if (['confirmed', 'checked_in'].includes(reservation.status)) {
                    existing.occupancy += 1;
                }
            }
        });

        properties.forEach((property) => {
            const createdAt = property.createdAt ? new Date(property.createdAt) : null;
            if (!createdAt || createdAt < sixMonthsAgo) return;
            const key = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
            const existing = monthlyMetrics.find((item) => item.key === key);
            if (existing) {
                existing.properties += 1;
            }
        });

        const occupancy = properties.length
            ? Math.round((reservations.filter((reservation) => ['confirmed', 'checked_in'].includes(reservation.status)).length / Math.max(properties.length, 1)) * 100)
            : 0;

        res.json({
            success: true,
            analytics: {
                statusCounts,
                monthlyRevenue: monthlyMetrics.map(({ key, month, revenue }) => ({ key, month, revenue })),
                monthlyMetrics,
                occupancy,
                totalReservations: reservations.length,
                totalProperties: properties.length,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAccommodationAnalytics };
