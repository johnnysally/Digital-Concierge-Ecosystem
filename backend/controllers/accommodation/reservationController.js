const Reservation = require('../../models/accommodation/Reservation');
const Property = require('../../models/accommodation/Property');
const Room = require('../../models/accommodation/Room');
const { partner: partnerEmails } = require('../../services/emailService');
const { createNotification } = require('../../services/notificationService');
const logger = require('../../utils/logger');

const createReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.create({ ...req.body, partner: req.user._id });
        const property = await Property.findById(reservation.property);
        const room = await Room.findById(reservation.room);
        partnerEmails.sendNewReservation(req.user, {
            id: reservation._id, propertyName: property?.name || 'Property', roomNumber: room?.roomNumber || 'N/A',
            guestName: reservation.guestName, checkIn: reservation.checkIn, checkOut: reservation.checkOut, totalAmount: reservation.totalAmount,
        }).catch(e => logger.error(`New reservation email failed: ${e.message}`));
        createNotification({
            customerId: req.user._id, type: 'booking', title: 'New Reservation',
            message: `New reservation at ${property?.name}`, link: `/reservations/${reservation._id}`,
        }).catch(e => logger.error(`Notification failed: ${e.message}`));
        res.status(201).json({ success: true, reservation });
    } catch (error) { next(error); }
};

const getReservations = async (req, res, next) => {
    try {
        const { status, propertyId, page = 1, limit = 10 } = req.query;
        const query = { partner: req.user._id };
        if (status) query.status = status;
        if (propertyId) query.property = propertyId;
        const reservations = await Reservation.find(query).populate('property', 'name').populate('room', 'roomNumber type').populate('customer', 'firstName lastName email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
        const total = await Reservation.countDocuments(query);
        res.json({ success: true, reservations, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) { next(error); }
};

const getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findOne({ _id: req.params.id, partner: req.user._id }).populate('property').populate('room').populate('customer');
        if (!reservation) return res.status(404).json({ success: false, message: 'Reservation not found' });
        res.json({ success: true, reservation });
    } catch (error) { next(error); }
};

const updateReservationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const reservation = await Reservation.findOneAndUpdate({ _id: req.params.id, partner: req.user._id }, { status }, { new: true });
        if (!reservation) return res.status(404).json({ success: false, message: 'Reservation not found' });
        res.json({ success: true, reservation });
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
        }).catch(e => logger.error(`Cancellation email failed: ${e.message}`));
        res.json({ success: true, message: 'Reservation deleted' });
    } catch (error) { next(error); }
};

module.exports = { createReservation, getReservations, getReservation, updateReservationStatus, deleteReservation };