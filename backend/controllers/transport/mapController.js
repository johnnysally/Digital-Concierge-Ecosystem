const Vehicle = require('../../models/transport/Vehicle');
const Ride = require('../../models/transport/Ride');
const Driver = require('../../models/transport/Driver');

const getActiveVehicles = async (req, res, next) => {
    try {
        const vehicles = await Vehicle.find({
            partner: req.user._id,
            status: { $in: ['available', 'on_trip'] },
        }).select('type make model plateNumber location dispatchStatus status driver currentTrip').populate('driver', 'firstName lastName phone');

        res.json({ success: true, vehicles });
    } catch (error) { next(error); }
};

const getVehicleLocation = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findOne({ _id: req.params.id, partner: req.user._id })
            .select('location dispatchStatus status driver currentTrip')
            .populate('driver', 'firstName lastName phone');
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        res.json({ success: true, vehicle });
    } catch (error) { next(error); }
};

const updateVehicleLocation = async (req, res, next) => {
    try {
        const { coordinates } = req.body;
        const vehicle = await Vehicle.findOneAndUpdate(
            { _id: req.params.id, partner: req.user._id },
            { location: { type: 'Point', coordinates } },
            { new: true }
        );
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        res.json({ success: true, vehicle });
    } catch (error) { next(error); }
};

const getActiveTrips = async (req, res, next) => {
    try {
        const rides = await Ride.find({
            partner: req.user._id,
            status: { $in: ['accepted', 'arrived', 'in_progress'] },
        }).populate('vehicle', 'plateNumber location dispatchStatus').populate('driver', 'firstName lastName phone').populate('customer', 'firstName lastName phone');

        res.json({ success: true, rides });
    } catch (error) { next(error); }
};

const getTripRoute = async (req, res, next) => {
    try {
        const ride = await Ride.findOne({ _id: req.params.id, partner: req.user._id })
            .select('pickup dropoff status fare')
            .populate('vehicle', 'plateNumber location dispatchStatus');
        if (!ride) return res.status(404).json({ success: false, message: 'Ride not found' });
        res.json({ success: true, ride });
    } catch (error) { next(error); }
};

module.exports = { getActiveVehicles, getVehicleLocation, updateVehicleLocation, getActiveTrips, getTripRoute };