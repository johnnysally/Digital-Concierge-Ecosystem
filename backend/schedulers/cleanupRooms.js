const Room = require('../models/accommodation/Room');
const Booking = require('../models/customer/Booking');
const logger = require('../utils/logger');

const cleanupRooms = async () => {
    try {
        const now = new Date();
        const thirtyMinAgo = new Date(now - 30 * 60 * 1000);

        const completedBookings = await Booking.find({ status: { $in: ['completed', 'checked_out', 'cancelled'] } });
        let releasedCompleted = 0;
        for (const booking of completedBookings) {
            const room = await Room.findById(booking.room);
            if (room && room.status === 'occupied') {
                room.status = 'available';
                await room.save();
                releasedCompleted++;
            }
        }

        const expiredBookings = await Booking.find({
            status: 'pending',
            paymentStatus: 'pending',
            createdAt: { $lt: thirtyMinAgo },
        });
        let releasedExpired = 0;
        for (const booking of expiredBookings) {
            booking.status = 'cancelled';
            booking.cancellationReason = 'Payment timeout - auto cancelled';
            await booking.save();
            const room = await Room.findById(booking.room);
            if (room && room.status === 'occupied') {
                room.status = 'available';
                await room.save();
                releasedExpired++;
            }
        }

        logger.info(`Room cleanup: ${releasedCompleted} completed, ${releasedExpired} expired payment`);
        return { completed: releasedCompleted, expired: releasedExpired };
    } catch (error) {
        logger.error(`Room cleanup failed: ${error.message}`);
        throw error;
    }
};

module.exports = cleanupRooms;