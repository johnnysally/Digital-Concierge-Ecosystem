const Wallet = require('../../models/customer/Wallet');
const Payment = require('../../models/customer/Payment');
const PlatformSettings = require('../../models/admin/PlatformSettings');
const { stripe: stripeService, mpesa: mpesaService } = require('../../services/paymentService');
const { customer: customerEmails } = require('../../services/emailService');
const { createNotification } = require('../../services/notificationService');
const logger = require('../../utils/logger');

const getPlatformCurrency = async () => {
    const setting = await PlatformSettings.findOne({ key: 'default_currency' });
    return setting?.value || 'KES';
};

const getWallet = async (req, res, next) => {
    try {
        let wallet = await Wallet.findOne({ customer: req.user._id });
        if (!wallet) {
            const currency = await getPlatformCurrency();
            wallet = await Wallet.create({ customer: req.user._id, balance: 0, currency });
        }
        res.json({ success: true, wallet });
    } catch (error) { next(error); }
};

const topUp = async (req, res, next) => {
    try {
        const { amount, method } = req.body;
        const currency = await getPlatformCurrency();
        let paymentResult;
        if (method === 'stripe') {
            const { clientSecret, paymentIntentId } = await stripeService.createPaymentIntent({ amount, currency, metadata: { customerId: req.user._id.toString(), type: 'wallet_topup' } });
            paymentResult = { clientSecret, paymentIntentId };
        } else if (method === 'mpesa') {
            const phone = req.body.phone || req.user.phone;
            if (!phone) return res.status(400).json({ success: false, message: 'Phone number required for M-Pesa' });
            const reference = `TOPUP-${Date.now()}`;
            const { checkoutRequestId } = await mpesaService.stkPush({ phone, amount, reference, description: 'Wallet Top-up' });
            paymentResult = { checkoutRequestId, reference };
        } else {
            return res.status(400).json({ success: false, message: 'Invalid payment method' });
        }
        await Payment.create({ customer: req.user._id, amount, currency, method, type: 'topup', status: 'pending', transactionId: paymentResult.paymentIntentId || paymentResult.checkoutRequestId, reference: paymentResult.reference || paymentResult.paymentIntentId, metadata: paymentResult });
        res.json({ success: true, payment: paymentResult, message: `Top-up of ${currency} ${amount} initiated via ${method}` });
    } catch (error) { next(error); }
};

const confirmTopUp = async (req, res, next) => {
    try {
        const { paymentIntentId, checkoutRequestId } = req.body;
        const query = {};
        if (paymentIntentId) query.transactionId = paymentIntentId;
        if (checkoutRequestId) query.transactionId = checkoutRequestId;
        query.customer = req.user._id;
        query.status = 'pending';
        const payment = await Payment.findOne(query);
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
        payment.status = 'completed';
        await payment.save();
        let wallet = await Wallet.findOne({ customer: req.user._id });
        if (!wallet) { const currency = await getPlatformCurrency(); wallet = await Wallet.create({ customer: req.user._id, balance: 0, currency }); }
        wallet.balance += payment.amount;
        wallet.transactions.push({ type: 'credit', amount: payment.amount, description: `Top-up via ${payment.method}`, reference: payment.reference || payment.transactionId, createdAt: new Date() });
        await wallet.save();
        customerEmails.sendWalletTopup(req.user, payment.amount, wallet.balance).catch(e => logger.error(`Wallet topup email failed: ${e.message}`));
        createNotification({ customerId: req.user._id, type: 'payment', title: 'Wallet Topped Up', message: `${payment.amount} added to your wallet.` }).catch(e => logger.error(`Notification failed: ${e.message}`));
        res.json({ success: true, wallet, message: 'Top-up confirmed' });
    } catch (error) { next(error); }
};

const addPaymentMethod = async (req, res, next) => {
    try {
        let wallet = await Wallet.findOne({ customer: req.user._id });
        if (!wallet) { const currency = await getPlatformCurrency(); wallet = await Wallet.create({ customer: req.user._id, balance: 0, currency }); }
        wallet.savedMethods.push(req.body);
        await wallet.save();
        res.json({ success: true, methods: wallet.savedMethods });
    } catch (error) { next(error); }
};

const updatePaymentMethod = async (req, res, next) => {
    try {
        const wallet = await Wallet.findOne({ customer: req.user._id });
        if (!wallet) return res.status(404).json({ success: false, message: 'Wallet not found' });
        const method = wallet.savedMethods.id(req.params.id);
        if (!method) return res.status(404).json({ success: false, message: 'Payment method not found' });
        Object.assign(method, req.body);
        await wallet.save();
        res.json({ success: true, methods: wallet.savedMethods });
    } catch (error) { next(error); }
};

const removePaymentMethod = async (req, res, next) => {
    try {
        const wallet = await Wallet.findOne({ customer: req.user._id });
        if (!wallet) return res.status(404).json({ success: false, message: 'Wallet not found' });
        wallet.savedMethods.pull({ _id: req.params.id });
        await wallet.save();
        res.json({ success: true, methods: wallet.savedMethods });
    } catch (error) { next(error); }
};

module.exports = { getWallet, topUp, confirmTopUp, addPaymentMethod, updatePaymentMethod, removePaymentMethod };