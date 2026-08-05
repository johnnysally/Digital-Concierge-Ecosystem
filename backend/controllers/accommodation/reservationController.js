const Reservation = require('../../models/accommodation/Reservation');
const Booking = require('../../models/customer/Booking');
const Property = require('../../models/accommodation/Property');
const Room = require('../../models/accommodation/Room');
const Customer = require('../../models/customer/Customer');
const { partner: partnerEmails, customer: customerEmails } = require('../../services/emailService');
const { createNotification } = require('../../services/notificationService');
const logger = require('../../utils/logger');

const createReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.create({ ...req.body, partner: req.user._id });
        const property = await Property.findById(reservation.property);
        const room = await Room.findById(reservation.room);

        partnerEmails.sendNewReservation(req.user, {
            id: reservation._id, propertyName: property?.name || 'Property',
            roomNumber: room?.roomNumber || 'N/A', guestName: reservation.guestName,
            checkIn: reservation.checkIn, checkOut: reservation.checkOut, totalAmount: reservation.totalAmount,
        }).catch(e => logger.error('New reservation email failed: ' + e.message));

        createNotification({
            partnerId: req.user._id.toString(),
            type: 'booking', title: 'New Reservation',
            message: 'New reservation at ' + (property?.name || 'Property'),
            link: '/reservations/' + reservation._id,
        }).catch(e => logger.error('Notification failed: ' + e.message));

        res.status(201).json({ success: true, reservation });
    } catch (error) { next(error); }
};

const getReservations = async (req, res, next) => {
    try {
        const { status, propertyId, page = 1, limit = 20 } = req.query;
        const properties = await Property.find({ partner: req.user._id }).select('_id');
        const propertyIds = properties.map(p => p._id);

        const directQuery = { partner: req.user._id };
        if (status) directQuery.status = status;
        if (propertyId) directQuery.property = propertyId;

        const bookingQuery = { property: { $in: propertyIds } };
        if (status) bookingQuery.status = status;

        const [directReservations, customerBookings] = await Promise.all([
            Reservation.find(directQuery).populate('property', 'name').populate('room', 'roomNumber type')
                .populate('customer', 'firstName lastName email').sort({ createdAt: -1 }).lean(),
            Booking.find(bookingQuery).populate('property', 'name').populate('room', 'roomNumber type')
                .populate('customer', 'firstName lastName email').sort({ createdAt: -1 }).lean(),
        ]);

        const allReservations = [
            ...directReservations.map(r => ({
                _id: r._id, guestName: r.guestName || (r.customer?.firstName + ' ' + r.customer?.lastName).trim() || 'Guest',
                status: r.status, paymentStatus: r.paymentStatus || 'pending', totalAmount: r.totalAmount,
                checkIn: r.checkIn, checkOut: r.checkOut, property: r.property, room: r.room,
                customer: r.customer, source: 'direct', createdAt: r.createdAt,
            })),
            ...customerBookings.map(b => ({
                _id: b._id, guestName: (b.customer?.firstName + ' ' + b.customer?.lastName).trim() || 'Guest',
                status: b.status, paymentStatus: b.paymentStatus || 'pending', totalAmount: b.totalAmount,
                checkIn: b.checkIn, checkOut: b.checkOut, property: b.property, room: b.room,
                customer: b.customer, source: 'booking', createdAt: b.createdAt,
            })),
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const total = allReservations.length;
        const paginated = allReservations.slice((page - 1) * limit, page * limit);

        res.json({ success: true, reservations: paginated, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) { next(error); }
};

const getReservation = async (req, res, next) => {
    try {
        let reservation = await Reservation.findOne({ _id: req.params.id, partner: req.user._id })
            .populate('property').populate('room').populate('customer');
        if (!reservation) {
            const booking = await Booking.findOne({ _id: req.params.id }).populate('property').populate('room').populate('customer');
            if (booking) {
                const property = await Property.findOne({ _id: booking.property, partner: req.user._id });
                if (!property) return res.status(404).json({ success: false, message: 'Reservation not found' });
                reservation = booking;
            }
        }
        if (!reservation) return res.status(404).json({ success: false, message: 'Reservation not found' });
        res.json({ success: true, reservation });
    } catch (error) { next(error); }
};

const updateReservationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        let reservation = await Reservation.findOne({ _id: req.params.id, partner: req.user._id });
        let isBooking = false;

        if (!reservation) {
            const booking = await Booking.findById(req.params.id);
            if (!booking) return res.status(404).json({ success: false, message: 'Reservation not found' });
            const propertyCheck = await Property.findOne({ _id: booking.property, partner: req.user._id });
            if (!propertyCheck) return res.status(404).json({ success: false, message: 'Reservation not found' });
            reservation = booking;
            isBooking = true;
        }

        const oldStatus = reservation.status;
        reservation.status = status;

        const paymentMap = { confirmed: 'paid', checked_in: 'paid', checked_out: 'paid', completed: 'paid', cancelled: 'refunded', no_show: 'refunded' };
        if (paymentMap[status]) reservation.paymentStatus = paymentMap[status];

        await reservation.save();

        const room = await Room.findById(reservation.room);
        if (room) {
            const roomMap = { confirmed: 'occupied', checked_in: 'occupied', checked_out: 'available', completed: 'available', cancelled: 'available', no_show: 'available' };
            if (roomMap[status]) { room.status = roomMap[status]; await room.save(); }
        }

        const property = await Property.findById(reservation.property);
        const customer = await Customer.findById(reservation.customer);

        if (customer && status !== oldStatus) {
            if (status === 'confirmed') {
                customerEmails.sendBookingConfirmed(customer, {
                    id: reservation._id,
                    propertyName: property?.name || 'Property',
                    checkIn: reservation.checkIn,
                    checkOut: reservation.checkOut,
                    guests: reservation.guests || 1,
                    totalAmount: reservation.totalAmount,
                }).catch(e => logger.error('Confirmation email failed: ' + e.message));

                createNotification({
                    customerId: customer._id.toString(),
                    type: 'booking',
                    title: 'Booking Confirmed',
                    message: 'Your stay at ' + (property?.name || 'Property') + ' has been confirmed.',
                    link: '/bookings/' + reservation._id,
                }).catch(e => logger.error('Notification failed: ' + e.message));
            }

            if (status === 'cancelled') {
                customerEmails.sendBookingCancelled(customer, {
                    id: reservation._id,
                    propertyName: property?.name || 'Property',
                    refundAmount: reservation.totalAmount,
                    refundStatus: 'Processing',
                }).catch(e => logger.error('Cancellation email failed: ' + e.message));

                createNotification({
                    customerId: customer._id.toString(),
                    type: 'booking',
                    title: 'Booking Cancelled',
                    message: 'Your booking at ' + (property?.name || 'Property') + ' has been cancelled.',
                    link: '/bookings',
                }).catch(e => logger.error('Notification failed: ' + e.message));
            }

            if (status === 'checked_in' || status === 'checked_out') {
                createNotification({
                    customerId: customer._id.toString(),
                    type: 'booking',
                    title: 'Booking ' + status.replace('_', ' '),
                    message: 'Your booking at ' + (property?.name || 'Property') + ' has been updated to ' + status.replace('_', ' ') + '.',
                    link: '/bookings/' + reservation._id,
                }).catch(e => logger.error('Notification failed: ' + e.message));
            }
        }

        res.json({
            success: true,
            reservation,
            message: 'Status: ' + status + ' | Payment: ' + (reservation.paymentStatus || 'N/A') + ' | Room: ' + (room?.status || 'N/A'),
        });
    } catch (error) { next(error); }
};
const deleteReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findOneAndDelete({ _id: req.params.id, partner: req.user._id });
        if (!reservation) return res.status(404).json({ success: false, message: 'Reservation not found' });
        const property = await Property.findById(reservation.property);
        partnerEmails.sendReservationCancelled(req.user, {
            propertyName: property?.name || 'Property', guestName: reservation.guestName,
            checkIn: reservation.checkIn, checkOut: reservation.checkOut,
        }).catch(e => logger.error('Cancellation email failed: ' + e.message));
        await Room.findByIdAndUpdate(reservation.room, { status: 'available' });
        res.json({ success: true, message: 'Reservation deleted and room freed' });
    } catch (error) { next(error); }
};

module.exports = { createReservation, getReservations, getReservation, updateReservationStatus, deleteReservation };