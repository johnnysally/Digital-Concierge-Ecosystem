const Vehicle = require('../../models/transport/Vehicle');
const Driver = require('../../models/transport/Driver');
const cloudinary = require('../../config/cloudinary');
const fs = require('fs');
const logger = require('../../utils/logger');

const createVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.create({ ...req.body, partner: req.user._id });
        if (req.body.driver) {
            await Driver.findByIdAndUpdate(req.body.driver, { assignedVehicle: vehicle._id, status: 'available' });
        }
        res.status(201).json({ success: true, vehicle });
    } catch (error) { next(error); }
};

const getVehicles = async (req, res, next) => {
    try {
        const { status, availability } = req.query;
        const query = { partner: req.user._id };
        if (status) query.status = status;
        if (availability) query.availability = availability;
        const vehicles = await Vehicle.find(query).populate('driver', 'firstName lastName phone').sort({ createdAt: -1 });
        res.json({ success: true, vehicles });
    } catch (error) { next(error); }
};

const getVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findOne({ _id: req.params.id, partner: req.user._id }).populate('driver', 'firstName lastName phone licenseNumber');
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        res.json({ success: true, vehicle });
    } catch (error) { next(error); }
};

const updateVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findOneAndUpdate({ _id: req.params.id, partner: req.user._id }, req.body, { new: true, runValidators: true });
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        if (req.body.driver) {
            await Driver.findByIdAndUpdate(req.body.driver, { assignedVehicle: vehicle._id, status: 'available' });
        }
        if (req.body.status === 'maintenance') {
            vehicle.availability = 'offline';
            await vehicle.save();
            if (vehicle.driver) await Driver.findByIdAndUpdate(vehicle.driver, { status: 'offline' });
        }
        res.json({ success: true, vehicle });
    } catch (error) { next(error); }
};

const deleteVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, partner: req.user._id });
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        if (vehicle.driver) await Driver.findByIdAndUpdate(vehicle.driver, { assignedVehicle: null });
        res.json({ success: true, message: 'Vehicle deleted' });
    } catch (error) { next(error); }
};

const toggleAvailability = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findOne({ _id: req.params.id, partner: req.user._id });
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        if (vehicle.status === 'maintenance') return res.status(400).json({ success: false, message: 'Vehicle under maintenance' });
        vehicle.availability = vehicle.availability === 'online' ? 'offline' : 'online';
        if (vehicle.availability === 'offline' && vehicle.driver) {
            await Driver.findByIdAndUpdate(vehicle.driver, { status: 'offline' });
        }
        if (vehicle.availability === 'online' && vehicle.driver && vehicle.status === 'idle') {
            await Driver.findByIdAndUpdate(vehicle.driver, { status: 'available' });
        }
        await vehicle.save();
        res.json({ success: true, vehicle, message: `Vehicle ${vehicle.availability === 'online' ? 'online' : 'offline'}` });
    } catch (error) { next(error); }
};

const addMaintenanceRecord = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findOne({ _id: req.params.id, partner: req.user._id });
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        vehicle.maintenance.serviceHistory.push({ ...req.body, date: req.body.date || new Date() });
        vehicle.maintenance.lastService = req.body.date || new Date();
        if (req.body.nextService) vehicle.maintenance.nextService = req.body.nextService;
        if (req.body.condition) vehicle.maintenance.condition = req.body.condition;
        if (req.body.condition === 'grounded' || req.body.condition === 'needs_service') {
            vehicle.status = 'maintenance';
            vehicle.availability = 'offline';
            if (vehicle.driver) await Driver.findByIdAndUpdate(vehicle.driver, { status: 'offline' });
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
        if (dispatchStatus === 'in_service') { update.status = 'on_trip'; }
        if (dispatchStatus === 'completed') { update.status = 'idle'; update.currentTrip = null; update.dispatchStatus = 'available'; }
        const vehicle = await Vehicle.findOneAndUpdate({ _id: req.params.id, partner: req.user._id }, update, { new: true });
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        if (vehicle.driver && dispatchStatus === 'completed') {
            await Driver.findByIdAndUpdate(vehicle.driver, { status: 'available', totalTrips: (await Driver.findById(vehicle.driver)).totalTrips + 1 });
        }
        res.json({ success: true, vehicle });
    } catch (error) { next(error); }
};

const uploadVehicleImages = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, message: 'No images uploaded' });
        const uploadPromises = req.files.map(file => new Promise((resolve, reject) => {
            cloudinary.uploader.upload(file.path, { folder: 'digital-safaris/vehicles' }, (error, result) => {
                fs.unlink(file.path, () => {});
                if (error) reject(error); else resolve(result.secure_url);
            });
        }));
        const imageUrls = await Promise.all(uploadPromises);
        res.json({ success: true, images: imageUrls });
    } catch (error) { next(error); }
};

module.exports = { createVehicle, getVehicles, getVehicle, updateVehicle, deleteVehicle, toggleAvailability, addMaintenanceRecord, getMaintenanceHistory, updateDispatchStatus, uploadVehicleImages };