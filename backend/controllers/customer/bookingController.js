const Booking = require('../../models/customer/Booking');
const Room = require('../../models/accommodation/Room');
const Property = require('../../models/accommodation/Property');

const createBooking = async (req, res, next) => {
    try {
        const { propertyId, roomId, checkIn, checkOut, guests, specialRequests } = req.body;

        const room = await Room.findById(roomId);
        if (!room || room.status !== 'available') return res.status(400).json({ success: false, message: 'Room not available' });

        const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
        const totalAmount = room.price * nights;

        const booking = await Booking.create({
            customer: req.user._id,
            property: propertyId,
            room: roomId,
            checkIn,
            checkOut,
            guests,
            totalAmount,
            specialRequests,
        });

        room.status = 'occupied';
        await room.save();

        res.status(201).json({ success: true, booking });
    } catch (error) {
        next(error);
    }
};

const getMyBookings = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = { customer: req.user._id };
        if (status) query.status = status;

        const bookings = await Booking.find(query)
            .populate('property', 'name address')
            .populate('room', 'roomNumber type')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Booking.countDocuments(query);

        res.json({ success: true, bookings, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        next(error);
    }
};

const getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id, customer: req.user._id })
            .populate('property')
            .populate('room');
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

        res.json({ success: true, booking });
    } catch (error) {
        next(error);
    }
};

const cancelBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id, customer: req.user._id });
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
        if (booking.status === 'cancelled') return res.status(400).json({ success: false, message: 'Booking already cancelled' });

        booking.status = 'cancelled';
        booking.cancelledAt = new Date();
        booking.cancellationReason = req.body.reason;
        await booking.save();

        await Room.findByIdAndUpdate(booking.room, { status: 'available' });

        res.json({ success: true, booking });
    } catch (error) {
        next(error);
    }
};

module.exports = { createBooking, getMyBookings, getBooking, cancelBooking };