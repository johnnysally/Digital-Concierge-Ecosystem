const SupportTicket = require('../../models/customer/SupportTicket');
const { createNotification } = require('../../services/notificationService');
const logger = require('../../utils/logger');

const createTicket = async (req, res, next) => {
    try {
        const { subject, description } = req.body;
        const ticket = await SupportTicket.create({
            customer: req.user._id,
            subject,
            description,
        });
        createNotification({
            customerId: req.user._id,
            type: 'system',
            title: 'Ticket Submitted',
            message: `Your support ticket "${subject}" has been received.`,
        }).catch(e => logger.error(`Notification failed: ${e.message}`));
        res.status(201).json({ success: true, ticket });
    } catch (error) { next(error); }
};

const getMyTickets = async (req, res, next) => {
    try {
        const tickets = await SupportTicket.find({ customer: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, tickets });
    } catch (error) { next(error); }
};

const getTicket = async (req, res, next) => {
    try {
        const ticket = await SupportTicket.findOne({ _id: req.params.id, customer: req.user._id });
        if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
        res.json({ success: true, ticket });
    } catch (error) { next(error); }
};

module.exports = { createTicket, getMyTickets, getTicket };