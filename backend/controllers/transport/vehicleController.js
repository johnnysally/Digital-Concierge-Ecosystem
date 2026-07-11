const Vehicle = require('../../models/transport/Vehicle');

const createVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.create({ ...req.body, partner: req.user._id });
        res.status(201).json({ success: true, vehicle });
    } catch (error) { next(error); }
};

const getVehicles = async (req, res, next) => {
    try {
        const { status } = req.query;
        const query = { partner: req.user._id };
        if (status) query.status = status;
        const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });
        res.json({ success: true, vehicles });
    } catch (error) { next(error); }
};

const getVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findOne({ _id: req.params.id, partner: req.user._id });
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

module.exports = { createVehicle, getVehicles, getVehicle, updateVehicle, deleteVehicle };