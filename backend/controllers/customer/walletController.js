const Wallet = require('../../models/customer/Wallet');

const getWallet = async (req, res, next) => {
    try {
        let wallet = await Wallet.findOne({ customer: req.user._id });
        if (!wallet) {
            wallet = await Wallet.create({ customer: req.user._id });
        }
        res.json({ success: true, wallet });
    } catch (error) {
        next(error);
    }
};

const topUp = async (req, res, next) => {
    try {
        const { amount, method } = req.body;

        const wallet = await Wallet.findOneAndUpdate(
            { customer: req.user._id },
            {
                $inc: { balance: amount },
                $push: { transactions: { type: 'credit', amount, description: `Top-up via ${method}`, reference: `TOPUP-${Date.now()}` } },
            },
            { new: true, upsert: true }
        );

        res.json({ success: true, wallet });
    } catch (error) {
        next(error);
    }
};

const addPaymentMethod = async (req, res, next) => {
    try {
        const wallet = await Wallet.findOne({ customer: req.user._id });
        if (!wallet) return res.status(404).json({ success: false, message: 'Wallet not found' });

        wallet.savedMethods.push(req.body);
        await wallet.save();

        res.json({ success: true, methods: wallet.savedMethods });
    } catch (error) {
        next(error);
    }
};

const removePaymentMethod = async (req, res, next) => {
    try {
        const wallet = await Wallet.findOne({ customer: req.user._id });
        wallet.savedMethods.pull({ _id: req.params.id });
        await wallet.save();

        res.json({ success: true, methods: wallet.savedMethods });
    } catch (error) {
        next(error);
    }
};

module.exports = { getWallet, topUp, addPaymentMethod, removePaymentMethod };