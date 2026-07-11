const Dispute = require('../../models/admin/Dispute');

const getAllDisputes = async (req, res, next) => {
    try {
        const { status, priority, page = 1, limit = 20 } = req.query;
        const query = {};
        if (status) query.status = status;
        if (priority) query.priority = priority;

        const disputes = await Dispute.find(query)
            .populate('customer', 'firstName lastName email')
            .populate('partner', 'firstName lastName businessName')
            .populate('resolvedBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit).limit(parseInt(limit));
        const total = await Dispute.countDocuments(query);

        res.json({ success: true, disputes, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) { next(error); }
};

const getDispute = async (req, res, next) => {
    try {
        const dispute = await Dispute.findById(req.params.id)
            .populate('customer', 'firstName lastName email')
            .populate('partner', 'firstName lastName businessName')
            .populate('resolvedBy', 'firstName lastName');
        if (!dispute) return res.status(404).json({ success: false, message: 'Dispute not found' });
        res.json({ success: true, dispute });
    } catch (error) { next(error); }
};

const updateDispute = async (req, res, next) => {
    try {
        const { status, resolution } = req.body;
        const update = { status };
        if (status === 'resolved' || status === 'closed') {
            update.resolution = resolution;
            update.resolvedBy = req.user._id;
            update.resolvedAt = new Date();
        }
        const dispute = await Dispute.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!dispute) return res.status(404).json({ success: false, message: 'Dispute not found' });
        res.json({ success: true, dispute });
    } catch (error) { next(error); }
};

module.exports = { getAllDisputes, getDispute, updateDispute };