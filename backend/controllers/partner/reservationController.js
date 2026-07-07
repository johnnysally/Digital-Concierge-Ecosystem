const Reservation = require('../../models/partner/Reservation');

const getReservations = async (req, res, next) => {
    try {
        const { status, propertyId, page = 1, limit = 10 } = req.query;
        const query = { partner: req.user._id };
        if (status) query.status = status;
        if (propertyId) query.property = propertyId;

        const reservations = await Reservation.find(query)
            .populate('property', 'name')
            .populate('room', 'roomNumber type')
            .populate('customer', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Reservation.countDocuments(query);

        res.json({ success: true, reservations, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        next(error);
    }
};

const getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findOne({ _id: req.params.id, partner: req.user._id })
            .populate('property')
            .populate('room')
            .populate('customer');
        if (!reservation) return res.status(404).json({ success: false, message: 'Reservation not found' });
        res.json({ success: true, reservation });
    } catch (error) {
        next(error);
    }
};

const updateReservationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const reservation = await Reservation.findOneAndUpdate(
            { _id: req.params.id, partner: req.user._id },
            { status },
            { new: true }
        );
        if (!reservation) return res.status(404).json({ success: false, message: 'Reservation not found' });
        res.json({ success: true, reservation });
    } catch (error) {
        next(error);
    }
};

module.exports = { getReservations, getReservation, updateReservationStatus };