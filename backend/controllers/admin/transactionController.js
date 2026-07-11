const Payment = require('../../models/customer/Payment');

const getAllTransactions = async (req, res, next) => {
    try {
        const { status, method, type, page = 1, limit = 20 } = req.query;
        const query = {};
        if (status) query.status = status;
        if (method) query.method = method;
        if (type) query.type = type;

        const transactions = await Payment.find(query)
            .populate('customer', 'firstName lastName email')
            .populate('booking')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit).limit(parseInt(limit));
        const total = await Payment.countDocuments(query);

        const revenue = await Payment.aggregate([
            { $match: { status: 'completed', type: 'payment' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        res.json({
            success: true,
            transactions,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            totalRevenue: revenue[0]?.total || 0,
        });
    } catch (error) { next(error); }
};

const getTransaction = async (req, res, next) => {
    try {
        const transaction = await Payment.findById(req.params.id)
            .populate('customer', 'firstName lastName email')
            .populate('booking');
        if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
        res.json({ success: true, transaction });
    } catch (error) { next(error); }
};

const refundTransaction = async (req, res, next) => {
    try {
        const transaction = await Payment.findByIdAndUpdate(
            req.params.id,
            { status: 'refunded', type: 'refund' },
            { new: true }
        );
        if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
        res.json({ success: true, transaction });
    } catch (error) { next(error); }
};

module.exports = { getAllTransactions, getTransaction, refundTransaction };