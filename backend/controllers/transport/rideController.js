const Ride = require('../../models/transport/Ride');
const Vehicle = require('../../models/transport/Vehicle');

const getRides = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const query = { partner: req.user._id };
        if (status) query.status = status;
        const rides = await Ride.find(query)
            .populate('vehicle', 'plateNumber make model type availableSeats totalSeats')
            .populate('driver', 'firstName lastName')
            .populate('customer', 'firstName lastName')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit).limit(parseInt(limit));
        const total = await Ride.countDocuments(query);
        res.json({ success: true, rides, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) { next(error); }
};

const getRide = async (req, res, next) => {
    try {
        const ride = await Ride.findOne({ _id: req.params.id, partner: req.user._id })
            .populate('vehicle').populate('driver').populate('customer');
        if (!ride) return res.status(404).json({ success: false, message: 'Ride not found' });
        res.json({ success: true, ride });
    } catch (error) { next(error); }
};

const updateRideStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const update = { status };
        if (status === 'completed') update.completedAt = new Date();
        if (status === 'in_progress') update.startedAt = new Date();

        const ride = await Ride.findOneAndUpdate({ _id: req.params.id, partner: req.user._id }, update, { new: true });
        if (!ride) return res.status(404).json({ success: false, message: 'Ride not found' });

        const vehicle = await Vehicle.findById(ride.vehicle);

        if (status === 'completed' || status === 'cancelled') {
            if (vehicle && ['van', 'bus'].includes(vehicle.type)) {
                vehicle.availableSeats = Math.min(vehicle.totalSeats, vehicle.availableSeats + (ride.seats || 1));
                vehicle.activeRides.pull(ride._id);
                if (vehicle.availableSeats > 0 && vehicle.status === 'on_trip') {
                    vehicle.status = 'idle';
                    vehicle.dispatchStatus = 'available';
                }
            } else if (vehicle) {
                vehicle.status = 'idle';
                vehicle.dispatchStatus = 'available';
            }
            if (vehicle) await vehicle.save();
        }

        res.json({ success: true, ride });
    } catch (error) { next(error); }
};

const deleteRide = async (req, res, next) => {
    try {
        const ride = await Ride.findOneAndDelete({ _id: req.params.id, partner: req.user._id });
        if (!ride) return res.status(404).json({ success: false, message: 'Ride not found' });

        const vehicle = await Vehicle.findById(ride.vehicle);
        if (vehicle && ['van', 'bus'].includes(vehicle.type)) {
            vehicle.availableSeats = Math.min(vehicle.totalSeats, vehicle.availableSeats + (ride.seats || 1));
            vehicle.activeRides.pull(ride._id);
            if (vehicle.availableSeats > 0 && vehicle.status === 'on_trip') {
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