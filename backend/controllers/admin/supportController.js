const SupportTicket = require('../../models/customer/SupportTicket');

const getAllTickets = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const query = {};
        if (status) query.status = status;
        const tickets = await SupportTicket.find(query)
            .populate('customer', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit).limit(parseInt(limit));
        const total = await SupportTicket.countDocuments(query);
        res.json({ success: true, tickets, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) { next(error); }
};

const getTicket = async (req, res, next) => {
    try {
        const ticket = await SupportTicket.findById(req.params.id).populate('customer', 'firstName lastName email');
        if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
        res.json({ success: true, ticket });
    } catch (error) { next(error); }
};

const updateTicket = async (req, res, next) => {
    try {
        const { status, priority, resolution } = req.body;
        const update = { status, priority };
        if (resolution) update.resolution = resolution;
        if (status === 'resolved' || status === 'closed') {
            update.resolvedAt = new Date();
            update.assignedTo = req.user._id;
        }
        const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
        res.json({ success: true, ticket });
    } catch (error) { next(error); }
};

module.exports = { getAllTickets, getTicket, updateTicket };