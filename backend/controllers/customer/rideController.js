const Ride = require('../../models/transport/Ride');
const Vehicle = require('../../models/transport/Vehicle');
const { createNotification } = require('../../services/notificationService');
const logger = require('../../utils/logger');

const createRide = async (req, res, next) => {
    try {
        const { vehicleId, pickup, dropoff } = req.body;
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle || vehicle.status !== 'available') return res.status(400).json({ success: false, message: 'Vehicle not available' });

        const distance = 5;
        const fare = vehicle.pricePerKm * distance;
        const total = fare + (vehicle.baseFare || 0);

        const ride = await Ride.create({
            partner: vehicle.partner,
            vehicle: vehicleId,
            customer: req.user._id,
            pickup,
            dropoff,
            fare: { base: vehicle.baseFare || 0, distance: fare, time: 0, total, currency: vehicle.currency || 'KES' },
            totalAmount: total,
        });

        await Vehicle.findByIdAndUpdate(vehicleId, { status: 'on_trip' });

        createNotification({
            customerId: req.user._id, type: 'transport', title: 'Ride Booked',
            message: `Your ride has been requested.`,
        }).catch(e => logger.error(`Notification failed: ${e.message}`));

        res.status(201).json({ success: true, ride });
    } catch (error) { next(error); }
};

const getMyRides = async (req, res, next) => {
    try {
        const rides = await Ride.find({ customer: req.user._id }).populate('vehicle', 'make model plateNumber').sort({ createdAt: -1 }).limit(20);
        res.json({ success: true, rides });
    } catch (error) { next(error); }
};

module.exports = { createRide, getMyRides };