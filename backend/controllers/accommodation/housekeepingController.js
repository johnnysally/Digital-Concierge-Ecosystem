const Housekeeping = require('../../models/accommodation/Housekeeping');
const { partner: partnerEmails } = require('../../services/emailService');
const logger = require('../../utils/logger');

const createTask = async (req, res, next) => {
    try {
        const task = await Housekeeping.create({ ...req.body, partner: req.user._id });
        if (task.assignedTo) {
            const Staff = require('../../models/accommodation/Staff');
            const staff = await Staff.findById(task.assignedTo);
            if (staff) {
                partnerEmails.sendHousekeepingAssigned(staff, { roomNumber: task.room, type: task.taskType, priority: task.priority }).catch(e => logger.error(`Housekeeping email failed: ${e.message}`));
            }
        }
        res.status(201).json({ success: true, task });
    } catch (error) { next(error); }
};

const getTasks = async (req, res, next) => {
    try {
        const { status, assignedTo, propertyId } = req.query; const query = { partner: req.user._id };
        if (status) query.status = status; if (assignedTo) query.assignedTo = assignedTo; if (propertyId) query.property = propertyId;
        const tasks = await Housekeeping.find(query).populate('property', 'name').populate('room', 'roomNumber').populate('assignedTo', 'firstName lastName').sort({ createdAt: -1 });
        res.json({ success: true, tasks });
    } catch (error) { next(error); }
};

const updateTask = async (req, res, next) => {
    try {
        const task = await Housekeeping.findOneAndUpdate({ _id: req.params.id, partner: req.user._id }, req.body, { new: true });
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        res.json({ success: true, task });
    } catch (error) { next(error); }
};

const deleteTask = async (req, res, next) => {
    try {
        const task = await Housekeeping.findOneAndDelete({ _id: req.params.id, partner: req.user._id });
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        res.json({ success: true, message: 'Task deleted' });
    } catch (error) { next(error); }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };