const Vehicle = require('../../models/transport/Vehicle');

const createVehicle = async (req, res, next) => {
    try { const vehicle = await Vehicle.create({ ...req.body, partner: req.user._id }); res.status(201).json({ success: true, vehicle }); }
    catch (error) { next(error); }
};

const getVehicles = async (req, res, next) => {
    try {
        const { status, dispatchStatus } = req.query; const query = { partner: req.user._id };
        if (status) query.status = status;
        if (dispatchStatus) query.dispatchStatus = dispatchStatus;
        res.json({ success: true, vehicles: await Vehicle.find(query).sort({ createdAt: -1 }) });
    } catch (error) { next(error); }
};

const getVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findOne({ _id: req.params.id, partner: req.user._id }).populate('driver', 'firstName lastName phone').populate('currentTrip');
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        res.json({ success: true, vehicle });
    } catch (error) { next(error); }
};

const updateVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findOneAndUpdate({ _id: req.params.id, partner: req.user._id }, req.body, { new: true, runValidators: true });
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        res.json({ success: true, vehicle });
    } catch (error) { next(error); }
};

const deleteVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, partner: req.user._id });
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        res.json({ success: true, message: 'Vehicle deleted' });
    } catch (error) { next(error); }
};

const addMaintenanceRecord = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findOne({ _id: req.params.id, partner: req.user._id });
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        vehicle.maintenance.serviceHistory.push(req.body);
        vehicle.maintenance.lastService = req.body.date || new Date();
        if (req.body.nextService) vehicle.maintenance.nextService = req.body.nextService;
        vehicle.maintenance.condition = req.body.condition || vehicle.maintenance.condition;
        if (req.body.condition === 'grounded' || req.body.condition === 'needs_service') {
            vehicle.status = 'maintenance';
        }
        await vehicle.save();
        res.json({ success: true, vehicle });
    } catch (error) { next(error); }
};

const getMaintenanceHistory = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findOne({ _id: req.params.id, partner: req.user._id }).select('maintenance');
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        res.json({ success: true, maintenance: vehicle.maintenance });
    } catch (error) { next(error); }
};

const updateDispatchStatus = async (req, res, next) => {
    try {
        const { dispatchStatus } = req.body;
        const update = { dispatchStatus };
        if (dispatchStatus === 'in_service') update.status = 'on_trip';
        if (dispatchStatus === 'completed') { update.status = 'available'; update.currentTrip = null; }
        const vehicle = await Vehicle.findOneAndUpdate({ _id: req.params.id, partner: req.user._id }, update, { new: true });
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        res.json({ success: true, vehicle });
    } catch (error) { next(error); }
};

module.exports = { createVehicle, getVehicles, getVehicle, updateVehicle, deleteVehicle, addMaintenanceRecord, getMaintenanceHistory, updateDispatchStatus };