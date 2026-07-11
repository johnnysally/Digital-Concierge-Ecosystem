const Staff = require('../../models/accommodation/Staff');
const { partner: partnerEmails } = require('../../services/emailService');
const logger = require('../../utils/logger');

const createStaff = async (req, res, next) => {
    try {
        const staff = await Staff.create({ ...req.body, partner: req.user._id });
        partnerEmails.sendStaffInvite(staff, `${process.env.PARTNER_URL}/staff/join/${staff._id}`, staff.role).catch(e => logger.error(`Staff invite email failed: ${e.message}`));
        res.status(201).json({ success: true, staff });
    } catch (error) { next(error); }
};

const getStaff = async (req, res, next) => {
    try {
        const { active } = req.query; const query = { partner: req.user._id };
        if (active !== undefined) query.active = active === 'true';
        res.json({ success: true, staff: await Staff.find(query).sort({ createdAt: -1 }) });
    } catch (error) { next(error); }
};

const getStaffMember = async (req, res, next) => {
    try {
        const staff = await Staff.findOne({ _id: req.params.id, partner: req.user._id });
        if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
        res.json({ success: true, staff });
    } catch (error) { next(error); }
};

const updateStaff = async (req, res, next) => {
    try {
        const staff = await Staff.findOneAndUpdate({ _id: req.params.id, partner: req.user._id }, req.body, { new: true, runValidators: true });
        if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
        res.json({ success: true, staff });
    } catch (error) { next(error); }
};

const deleteStaff = async (req, res, next) => {
    try {
        const staff = await Staff.findOneAndDelete({ _id: req.params.id, partner: req.user._id });
        if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
        res.json({ success: true, message: 'Staff removed' });
    } catch (error) { next(error); }
};

module.exports = { createStaff, getStaff, getStaffMember, updateStaff, deleteStaff };