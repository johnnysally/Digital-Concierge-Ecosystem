const Payment = require('../../models/customer/Payment');
const Wallet = require('../../models/customer/Wallet');
const { stripe: stripeService, mpesa: mpesaService } = require('../../services/paymentService');
const { customer: customerEmails } = require('../../services/emailService');
const { createNotification } = require('../../services/notificationService');
const logger = require('../../utils/logger');

const createStripePayment = async (req, res, next) => {
    try {
        const { amount, currency, bookingId } = req.body;
        const { clientSecret, paymentIntentId } = await stripeService.createPaymentIntent({ amount, currency, metadata: { customerId: req.user._id.toString(), bookingId } });
        const payment = await Payment.create({ customer: req.user._id, booking: bookingId, amount, currency, method: 'stripe', type: 'payment', status: 'pending', transactionId: paymentIntentId });
        res.json({ success: true, clientSecret, payment });
    } catch (error) { next(error); }
};

const confirmStripePayment = async (req, res, next) => {
    try {
        const { paymentIntentId } = req.body;
        const { status } = await stripeService.confirmPayment(paymentIntentId);
        const payment = await Payment.findOneAndUpdate({ transactionId: paymentIntentId }, { status: status === 'succeeded' ? 'completed' : 'failed', reference: paymentIntentId }, { new: true });
        if (status === 'succeeded') {
            await Wallet.findOneAndUpdate({ customer: req.user._id }, { $push: { transactions: { type: 'debit', amount: payment.amount, description: 'Payment', reference: paymentIntentId, createdAt: new Date() } } }, { upsert: true });
            customerEmails.sendPaymentReceived(req.user, { amount: payment.amount, method: 'Stripe', reference: paymentIntentId }).catch(e => logger.error(`Payment email failed: ${e.message}`));
            createNotification({ customerId: req.user._id, type: 'payment', title: 'Payment Received', message: `Payment of ${payment.amount} received.`, link: '/customer/payments' }).catch(e => logger.error(`Notification failed: ${e.message}`));
        } else {
            customerEmails.sendPaymentFailed(req.user, { amount: payment.amount, method: 'Stripe' }).catch(e => logger.error(`Payment failed email error: ${e.message}`));
        }
        res.json({ success: true, payment });
    } catch (error) { next(error); }
};

const initiateMpesaPayment = async (req, res, next) => {
    try {
        const { phone, amount, bookingId } = req.body;
        const reference = `DC-${Date.now()}`;
        const { checkoutRequestId } = await mpesaService.stkPush({ phone, amount, reference, description: 'Booking Payment' });
        const payment = await Payment.create({ customer: req.user._id, booking: bookingId, amount, method: 'mpesa', type: 'payment', status: 'pending', transactionId: checkoutRequestId, reference });
        res.json({ success: true, checkoutRequestId, payment });
    } catch (error) { next(error); }
};

const mpesaCallback = async (req, res, next) => {
    try {
        const { Body } = req.body;
        const { CheckoutRequestID, ResultCode, ResultDesc } = Body.stkCallback;
        const status = ResultCode === 0 ? 'completed' : 'failed';
        const payment = await Payment.findOneAndUpdate({ transactionId: CheckoutRequestID }, { status }, { new: true });
        if (status === 'completed' && payment) {
            customerEmails.sendPaymentReceived(payment.customer, { amount: payment.amount, method: 'M-Pesa', reference: CheckoutRequestID }).catch(e => logger.error(`M-Pesa payment email failed: ${e.message}`));
        }
        res.json({ success: true });
    } catch (error) { next(error); }
};

const getPaymentHistory = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const payments = await Payment.find({ customer: req.user._id }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
        const total = await Payment.countDocuments({ customer: req.user._id });
        res.json({ success: true, payments, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) { next(error); }
};

const getPayment = async (req, res, next) => {
    try {
        const payment = await Payment.findOne({ _id: req.params.id, customer: req.user._id });
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
        res.json({ success: true, payment });
    } catch (error) { next(error); }
};

module.exports = { createStripePayment, confirmStripePayment, initiateMpesaPayment, mpesaCallback, getPaymentHistory, getPayment };