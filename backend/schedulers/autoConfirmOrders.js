const Order = require('../models/restaurant/Order');
const Ride = require('../models/transport/Ride');
const Booking = require('../models/customer/Booking');
const logger = require('../utils/logger');

const autoConfirmOrders = async () => {
    try {
        const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const ordersResult = await Order.updateMany(
            { status: 'delivered', updatedAt: { $lt: cutoffTime } },
            { $set: { status: 'completed' } }
        );

        const ridesResult = await Ride.updateMany(
            { status: 'delivered', updatedAt: { $lt: cutoffTime } },
            { $set: { status: 'completed' } }
        );

        const bookingsResult = await Booking.updateMany(
            { status: 'checked_out', updatedAt: { $lt: cutoffTime } },
            { $set: { status: 'completed' } }
        );

        logger.info(`Auto-confirmed: ${ordersResult.modifiedCount} orders, ${ridesResult.modifiedCount} rides, ${bookingsResult.modifiedCount} bookings`);
        return { orders: ordersResult.modifiedCount, rides: ridesResult.modifiedCount, bookings: bookingsResult.modifiedCount };
    } catch (error) {
        logger.error(`Auto-confirm failed: ${error.message}`);
    }
};

module.exports = autoConfirmOrders;