const Driver = require('../../models/transport/Driver');
const Vehicle = require('../../models/transport/Vehicle');
const { partner: partnerEmails } = require('../../services/emailService');
const logger = require('../../utils/logger');

const createDriver = async (req, res, next) => {
    try {
        const driver = await Driver.create({ ...req.body, partner: req.user._id });
        if (req.body.assignedVehicle) {
            await Vehicle.findByIdAndUpdate(req.body.assignedVehicle, { driver: driver._id });
            driver.status = 'available';
            await driver.save();
        }
        if (req.body.sendInvite) {
            partnerEmails.sendStaffInvite(driver, `${process.env.PARTNER_URL}/driver/join/${driver._id}`, 'driver').catch(e => logger.error(`Driver invite email failed: ${e.message}`));
        }
        res.status(201).json({ success: true, driver });
    } catch (error) { next(error); }
};

const getDrivers = async (req, res, next) => {
    try {
        const { status, active } = req.query;
        const query = { partner: req.user._id };
        if (status) query.status = status;
        if (active !== undefined) query.active = active === 'true';
        const drivers = await Driver.find(query).populate('assignedVehicle', 'make model plateNumber type').sort({ createdAt: -1 });
        res.json({ success: true, drivers });
    } catch (error) { next(error); }
};

const getDriver = async (req, res, next) => {
    try {
        const driver = await Driver.findOne({ _id: req.params.id, partner: req.user._id }).populate('assignedVehicle', 'make model plateNumber type');
        if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
        res.json({ success: true, driver });
    } catch (error) { next(error); }
};

const updateDriver = async (req, res, next) => {
    try {
        const driver = await Driver.findOneAndUpdate({ _id: req.params.id, partner: req.user._id }, req.body, { new: true, runValidators: true });
        if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
        if (req.body.assignedVehicle) {
            await Vehicle.findByIdAndUpdate(req.body.assignedVehicle, { driver: driver._id });
        }
        res.json({ success: true, driver });
    } catch (error) { next(error); }
};

const deleteDriver = async (req, res, next) => {
    try {
        const driver = await Driver.findOneAndDelete({ _id: req.params.id, partner: req.user._id });
        if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
        if (driver.assignedVehicle) await Vehicle.findByIdAndUpdate(driver.assignedVehicle, { driver: null });
        res.json({ success: true, message: 'Driver removed' });
    } catch (error) { next(error); }
};

const toggleStatus = async (req, res, next) => {
    try {
        const driver = await Driver.findOne({ _id: req.params.id, partner: req.user._id });
        if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
        driver.status = driver.status === 'offline' ? 'available' : 'offline';
        await driver.save();
        if (driver.assignedVehicle) {
            await Vehicle.findByIdAndUpdate(driver.assignedVehicle, {
                availability: driver.status === 'available' ? 'online' : 'offline',
            });
        }
        res.json({ success: true, driver });
    } catch (error) { next(error); }
};

module.exports = { createDriver, getDrivers, getDriver, updateDriver, deleteDriver, toggleStatus };