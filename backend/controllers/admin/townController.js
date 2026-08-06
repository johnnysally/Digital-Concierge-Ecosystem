const Town = require('../../models/admin/Town');
const Destination = require('../../models/admin/Destination');
const logger = require('../../utils/logger');

const createTown = async (req, res, next) => {
    try {
        const town = await Town.create({ ...req.body, createdBy: req.user._id });
        res.status(201).json({ success: true, town });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ success: false, message: 'Town already exists' });
        next(error);
    }
};

const getTowns = async (req, res, next) => {
    try {
        const { active } = req.query;
        const query = {};
        if (active !== undefined) query.isActive = active === 'true';
        const towns = await Town.find(query).sort({ name: 1 });
        res.json({ success: true, towns });
    } catch (error) { next(error); }
};

const getTown = async (req, res, next) => {
    try {
        const town = await Town.findById(req.params.id);
        if (!town) return res.status(404).json({ success: false, message: 'Town not found' });
        res.json({ success: true, town });
    } catch (error) { next(error); }
};

const updateTown = async (req, res, next) => {
    try {
        const town = await Town.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!town) return res.status(404).json({ success: false, message: 'Town not found' });
        res.json({ success: true, town });
    } catch (error) { next(error); }
};

const deleteTown = async (req, res, next) => {
    try {
        const town = await Town.findByIdAndDelete(req.params.id);
        if (!town) return res.status(404).json({ success: false, message: 'Town not found' });
        await Destination.deleteMany({ town: req.params.id });
        res.json({ success: true, message: 'Town and destinations deleted' });
    } catch (error) { next(error); }
};

const createDestination = async (req, res, next) => {
    try {
        const town = await Town.findById(req.body.town);
        if (!town) return res.status(404).json({ success: false, message: 'Town not found' });
        const dest = await Destination.create({ ...req.body, createdBy: req.user._id });
        res.status(201).json({ success: true, destination: dest });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ success: false, message: 'Destination already exists in this town' });
        next(error);
    }
};

const getDestinations = async (req, res, next) => {
    try {
        const { town, active } = req.query;
        const query = {};
        if (town) query.town = town;
        if (active !== undefined) query.isActive = active === 'true';
        const destinations = await Destination.find(query).populate('town', 'name').sort({ name: 1 });
        res.json({ success: true, destinations });
    } catch (error) { next(error); }
};

const updateDestination = async (req, res, next) => {
    try {
        const dest = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!dest) return res.status(404).json({ success: false, message: 'Destination not found' });
        res.json({ success: true, destination: dest });
    } catch (error) { next(error); }
};

const deleteDestination = async (req, res, next) => {
    try {
        const dest = await Destination.findByIdAndDelete(req.params.id);
        if (!dest) return res.status(404).json({ success: false, message: 'Destination not found' });
        res.json({ success: true, message: 'Deleted' });
    } catch (error) { next(error); }
};

module.exports = { createTown, getTowns, getTown, updateTown, deleteTown, createDestination, getDestinations, updateDestination, deleteDestination };