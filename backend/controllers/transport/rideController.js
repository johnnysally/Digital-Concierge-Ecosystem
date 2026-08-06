const Ride = require('../../models/transport/Ride');
const Vehicle = require('../../models/transport/Vehicle');
const Driver = require('../../models/transport/Driver');
const { createNotification } = require('../../services/notificationService');
const logger = require('../../utils/logger');

const getRides = async (req, res, next) => {
    try {
        const { status, isLongDistance, page = 1, limit = 20 } = req.query;
        const query = { partner: req.user._id };
        if (status) query.status = status;
        if (isLongDistance !== undefined) query.isLongDistance = isLongDistance === 'true';
        const rides = await Ride.find(query)
            .populate('vehicle', 'plateNumber make model type availableSeats totalSeats')
            .populate('driver', 'firstName lastName')
            .populate('customer', 'firstName lastName phone')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit).limit(parseInt(limit));
        const total = await Ride.countDocuments(query);
        res.json({ success: true, rides, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) { next(error); }
};

const getRide = async (req, res, next) => {
    try {
        const ride = await Ride.findOne({ _id: req.params.id, partner: req.user._id })
            .populate('vehicle').populate('driver').populate('customer', 'firstName lastName phone email');
        if (!ride) return res.status(404).json({ success: false, message: 'Ride not found' });
        res.json({ success: true, ride });
    } catch (error) { next(error); }
};

const statusMessages = {
    accepted: 'Your ride has been accepted. Driver is on the way.',
    arrived: 'Driver has arrived at pickup location.',
    in_progress: 'Your trip has started.',
    completed: 'Your ride is complete. Thank you for traveling with us!',
    cancelled: 'Your ride has been cancelled.',
};

const updateRideStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const update = { status };
        if (status === 'completed') update.completedAt = new Date();
        if (status === 'in_progress') update.startedAt = new Date();

        const ride = await Ride.findOneAndUpdate({ _id: req.params.id, partner: req.user._id }, update, { new: true })
            .populate('customer', 'firstName lastName email');

        if (!ride) return res.status(404).json({ success: false, message: 'Ride not found' });

        if (status === 'completed' || status === 'cancelled') {
            const vehicle = await Vehicle.findById(ride.vehicle);
            if (vehicle && vehicle.isLongDistance) {
                vehicle.availableSeats = Math.min(vehicle.totalSeats, vehicle.availableSeats + (ride.seats || 1));
                vehicle.activeRides.pull(ride._id);
                if (vehicle.availableSeats > 0 && vehicle.activeRides.length === 0) {
                    vehicle.status = 'idle';
                    vehicle.dispatchStatus = 'available';
                }
            } else if (vehicle) {
                vehicle.status = 'idle';
                vehicle.dispatchStatus = 'available';
            }
            if (vehicle) await vehicle.save();
        }

        if (ride.customer && statusMessages[status]) {
            createNotification({
                customerId: ride.customer._id.toString(),
                type: 'transport',
                title: 'Ride Update',
                message: statusMessages[status],
            }).catch(e => logger.error('Customer notification failed: ' + e.message));
        }

        res.json({ success: true, ride });
    } catch (error) { next(error); }
};

const deleteRide = async (req, res, next) => {
    try {
        const ride = await Ride.findOneAndDelete({ _id: req.params.id, partner: req.user._id });
        if (!ride) return res.status(404).json({ success: false, message: 'Ride not found' });

        const vehicle = await Vehicle.findById(ride.vehicle);
        if (vehicle && vehicle.isLongDistance) {
            vehicle.availableSeats = Math.min(vehicle.totalSeats, vehicle.availableSeats + (ride.seats || 1));
            vehicle.activeRides.pull(ride._id);
            if (vehicle.availableSeats > 0 && vehicle.activeRides.length === 0) {
                vehicle.status = 'idle';
                vehicle.dispatchStatus = 'available';
            }
            await vehicle.save();
        } else if (vehicle) {
            vehicle.status = 'idle';
            vehicle.dispatchStatus = 'available';
            await vehicle.save();
        }

        res.json({ success: true, message: 'Ride deleted' });
    } catch (error) { next(error); }
};

module.exports = { getRides, getRide, updateRideStatus, deleteRide };