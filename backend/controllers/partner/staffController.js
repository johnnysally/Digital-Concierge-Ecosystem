const Staff = require('../../models/partner/Staff');

const createStaff = async (req, res, next) => {
    try {
        const staff = await Staff.create({ ...req.body, partner: req.user._id });
        res.status(201).json({ success: true, staff });
    } catch (error) {
        next(error);
    }
};

const getStaff = async (req, res, next) => {
    try {
        const { active } = req.query;
        const query = { partner: req.user._id };
        if (active !== undefined) query.active = active === 'true';

        const staff = await Staff.find(query).sort({ createdAt: -1 });
        res.json({ success: true, staff });
    } catch (error) {
        next(error);
    }
};

const getStaffMember = async (req, res, next) => {
    try {
        const staff = await Staff.findOne({ _id: req.params.id, partner: req.user._id });
        if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
        res.json({ success: true, staff });
    } catch (error) {
        next(error);
    }
};

const updateStaff = async (req, res, next) => {
    try {
        const staff = await Staff.findOneAndUpdate(
            { _id: req.params.id, partner: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
        res.json({ success: true, staff });
    } catch (error) {
        next(error);
    }
};

const deleteStaff = async (req, res, next) => {
    try {
        const staff = await Staff.findOneAndDelete({ _id: req.params.id, partner: req.user._id });
        if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
        res.json({ success: true, message: 'Staff removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = { createStaff, getStaff, getStaffMember, updateStaff, deleteStaff };