const Driver = require('../../models/transport/Driver');

const createDriver = async (req, res, next) => {
    try {
        const driver = await Driver.create({ ...req.body, partner: req.user._id });
        res.status(201).json({ success: true, driver });
    } catch (error) { next(error); }
};

const getDrivers = async (req, res, next) => {
    try {
        const { status, active } = req.query;
        const query = { partner: req.user._id };
        if (status) query.status = status;
        if (active !== undefined) query.active = active === 'true';
        const drivers = await Driver.find(query).sort({ createdAt: -1 });
        res.json({ success: true, drivers });
    } catch (error) { next(error); }
};

const getDriver = async (req, res, next) => {
    try {
        const driver = await Driver.findOne({ _id: req.params.id, partner: req.user._id });
        if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
        res.json({ success: true, driver });
    } catch (error) { next(error); }
};

const updateDriver = async (req, res, next) => {
    try {
        const driver = await Driver.findOneAndUpdate({ _id: req.params.id, partner: req.user._id }, req.body, { new: true, runValidators: true });
        if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
        res.json({ success: true, driver });
    } catch (error) { next(error); }
};

const deleteDriver = async (req, res, next) => {
    try {
        const driver = await Driver.findOneAndDelete({ _id: req.params.id, partner: req.user._id });
        if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
        res.json({ success: true, message: 'Driver deleted' });
    } catch (error) { next(error); }
};

module.exports = { createDriver, getDrivers, getDriver, updateDriver, deleteDriver };