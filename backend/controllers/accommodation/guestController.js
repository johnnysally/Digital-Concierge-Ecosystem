const Reservation = require('../../models/accommodation/Reservation');
const Booking = require('../../models/customer/Booking');
const Customer = require('../../models/customer/Customer');
const Property = require('../../models/accommodation/Property');

const getGuests = async (req, res, next) => {
    try {
        const properties = await Property.find({ partner: req.user._id }).select('_id');
        const propertyIds = properties.map(p => p._id);

        const [directGuests, bookingGuests] = await Promise.all([
            Reservation.find({ partner: req.user._id }).distinct('customer'),
            Booking.find({ property: { $in: propertyIds } }).distinct('customer'),
        ]);

        const allGuestIds = [...new Set([...directGuests.map(String), ...bookingGuests.map(String)])];

        const guests = await Customer.find({ _id: { $in: allGuestIds } })
            .select('firstName lastName email phone createdAt')
            .sort({ createdAt: -1 });

        res.json({ success: true, guests, total: guests.length });
    } catch (error) { next(error); }
};

const getGuest = async (req, res, next) => {
    try {
        const guest = await Customer.findById(req.params.id).select('firstName lastName email phone createdAt');
        if (!guest) return res.status(404).json({ success: false, message: 'Guest not found.' });

        const properties = await Property.find({ partner: req.user._id }).select('_id');
        const propertyIds = properties.map(p => p._id);

        const [directReservations, customerBookings] = await Promise.all([
            Reservation.find({ partner: req.user._id, customer: req.params.id })
                .populate('property', 'name').populate('room', 'roomNumber').sort({ createdAt: -1 }).lean(),
            Booking.find({ property: { $in: propertyIds }, customer: req.params.id })
                .populate('property', 'name').populate('room', 'roomNumber').sort({ createdAt: -1 }).lean(),
        ]);

        const allStays = [
            ...directReservations.map(r => ({
                _id: r._id, property: r.property, room: r.room, checkIn: r.checkIn, checkOut: r.checkOut,
                status: r.status, totalAmount: r.totalAmount, source: 'direct', createdAt: r.createdAt,
            })),
            ...customerBookings.map(b => ({
                _id: b._id, property: b.property, room: b.room, checkIn: b.checkIn, checkOut: b.checkOut,
                status: b.status, totalAmount: b.totalAmount, source: 'booking', createdAt: b.createdAt,
            })),
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        res.json({ success: true, guest, stays: allStays, totalStays: allStays.length });
    } catch (error) { next(error); }
};

module.exports = { getGuests, getGuest };