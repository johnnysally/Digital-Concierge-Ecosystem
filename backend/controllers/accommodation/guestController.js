const Reservation = require('../../models/accommodation/Reservation');
const Customer = require('../../models/customer/Customer');

const getGuests = async (req, res, next) => {
    try {
        const reservations = await Reservation.find({ partner: req.user._id }).distinct('customer');
        const guests = await Customer.find({ _id: { $in: reservations } }).select('firstName lastName email phone');
        res.json({ success: true, guests });
    } catch (error) { next(error); }
};

const getGuest = async (req, res, next) => {
    try {
        const guest = await Customer.findById(req.params.id).select('firstName lastName email phone');
        if (!guest) return res.status(404).json({ success: false, message: 'Guest not found' });
        const guestReservations = await Reservation.find({ partner: req.user._id, customer: req.params.id })
            .populate('property', 'name').populate('room', 'roomNumber').sort({ createdAt: -1 });
        res.json({ success: true, guest, reservations: guestReservations });
    } catch (error) { next(error); }
};

module.exports = { getGuests, getGuest };