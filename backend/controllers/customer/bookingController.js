const Booking = require('../../models/customer/Booking');
const Room = require('../../models/accommodation/Room');
const Property = require('../../models/accommodation/Property');
const AccommodationPartner = require('../../models/accommodation/AccommodationPartner');
const { customer: customerEmails, partner: partnerEmails } = require('../../services/emailService');
const { createNotification } = require('../../services/notificationService');
const logger = require('../../utils/logger');

const createBooking = async (req, res, next) => {
    try {
        const { propertyId, roomId, checkIn, checkOut, guests, specialRequests } = req.body;

        if (!propertyId || !roomId || !checkIn || !checkOut) {
            return res.status(400).json({ success: false, message: 'Property, room, check-in and check-out dates are required.' });
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const now = new Date();

        if (checkInDate < new Date(now.setHours(0, 0, 0, 0))) {
            return res.status(400).json({ success: false, message: 'Check-in date cannot be in the past.' });
        }
        if (checkOutDate <= checkInDate) {
            return res.status(400).json({ success: false, message: 'Check-out must be after check-in.' });
        }

        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ success: false, message: 'Room not found.' });
        if (room.status !== 'available') return res.status(400).json({ success: false, message: 'Room is not available for booking.' });

        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });
        if (!property.published) return res.status(400).json({ success: false, message: 'Property is not available.' });

        if (guests > room.capacity) {
            return res.status(400).json({ success: false, message: `Room capacity is ${room.capacity} guest(s).` });
        }

        const nights = Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)));
        const totalAmount = room.price * nights;

        const booking = await Booking.create({
            customer: req.user._id,
            property: propertyId,
            room: roomId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests: guests || 1,
            totalAmount,
            specialRequests,
            status: 'confirmed',
        });

        room.status = 'occupied';
        await room.save();

        const customerName = `${req.user.firstName} ${req.user.lastName}`;

        customerEmails.sendBookingConfirmed(req.user, {
            id: booking._id,
            propertyName: property.name,
            checkIn: checkInDate.toISOString().split('T')[0],
            checkOut: checkOutDate.toISOString().split('T')[0],
            guests: guests || 1,
            totalAmount,
        }).catch(e => logger.error(`Booking confirmation email failed: ${e.message}`));

        createNotification({
            customerId: req.user._id,
            type: 'booking',
            title: 'Booking Confirmed',
            message: `Your stay at ${property.name} is confirmed for ${checkInDate.toISOString().split('T')[0]}.`,
            link: `/bookings/${booking._id}`,
        }).catch(e => logger.error(`Notification failed: ${e.message}`));

        const partner = await AccommodationPartner.findById(property.partner);
        if (partner) {
            partnerEmails.sendNewReservation(partner, {
                id: booking._id,
                propertyName: property.name,
                roomNumber: room.roomNumber,
                guestName: customerName,
                checkIn: checkInDate.toISOString().split('T')[0],
                checkOut: checkOutDate.toISOString().split('T')[0],
                totalAmount,
            }).catch(e => logger.error(`Partner notification email failed: ${e.message}`));

            createNotification({
                customerId: partner._id,
                type: 'booking',
                title: 'New Reservation',
                message: `${customerName} booked ${property.name} - Room ${room.roomNumber}.`,
            }).catch(e => logger.error(`Partner notification failed: ${e.message}`));
        }

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
            .populate('property', 'name address city photos')
            .populate('room', 'roomNumber type price')
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

        const checkInDate = new Date(booking.checkIn);
        const now = new Date();
        const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursUntilCheckIn < 24) {
            return res.status(400).json({ success: false, message: 'Cannot cancel within 24 hours of check-in.' });
        }

        booking.status = 'cancelled';
        booking.cancelledAt = new Date();
        booking.cancellationReason = req.body.reason;
        await booking.save();
        await Room.findByIdAndUpdate(booking.room, { status: 'available' });

        const property = await Property.findById(booking.property);
        customerEmails.sendBookingCancelled(req.user, {
            id: booking._id,
            propertyName: property?.name || 'Property',
            refundAmount: booking.totalAmount,
            refundStatus: 'Processing',
        }).catch(e => logger.error(`Cancellation email failed: ${e.message}`));

        res.json({ success: true, booking });
    } catch (error) {
        next(error);
    }
};

module.exports = { createBooking, getMyBookings, getBooking, cancelBooking };