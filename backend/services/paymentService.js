const { STRIPE, MPESA } = require('../config/env');
const logger = require('../utils/logger');
const axios = require('axios');

let stripe;
if (STRIPE.SECRET_KEY) {
    stripe = require('stripe')(STRIPE.SECRET_KEY);
}

const createStripePaymentIntent = async ({ amount, currency = 'usd', metadata = {} }) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency,
        metadata,
    });
    return { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id };
};

const confirmStripePayment = async (paymentIntentId) => {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return { status: paymentIntent.status, paymentIntentId };
};

const refundStripePayment = async (paymentIntentId, amount) => {
    const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
    });
    return { refundId: refund.id, status: refund.status };
};

const getMpesaAuthToken = async () => {
    const auth = Buffer.from(`${MPESA.CONSUMER_KEY}:${MPESA.CONSUMER_SECRET}`).toString('base64');
    const baseUrl = MPESA.ENV === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke';
    const { data } = await axios.get(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: { Authorization: `Basic ${auth}` },
    });
    return data.access_token;
};

const stkPush = async ({ phone, amount, reference, description }) => {
    const token = await getMpesaAuthToken();
    const baseUrl = MPESA.ENV === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke';
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const password = Buffer.from(`${MPESA.SHORTCODE}${MPESA.PASSKEY}${timestamp}`).toString('base64');

    const { data } = await axios.post(
        `${baseUrl}/mpesa/stkpush/v1/processrequest`,
        {
            BusinessShortCode: MPESA.SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: Math.round(amount),
            PartyA: phone,
            PartyB: MPESA.SHORTCODE,
            PhoneNumber: phone,
            CallBackURL: MPESA.CALLBACK_URL,
            AccountReference: reference,
            TransactionDesc: description || 'Digital Concierge Payment',
        },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return { checkoutRequestId: data.CheckoutRequestID, responseCode: data.ResponseCode };
};

const queryStkStatus = async (checkoutRequestId) => {
    const token = await getMpesaAuthToken();
    const baseUrl = MPESA.ENV === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke';
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const password = Buffer.from(`${MPESA.SHORTCODE}${MPESA.PASSKEY}${timestamp}`).toString('base64');

    const { data } = await axios.post(
        `${baseUrl}/mpesa/stkpushquery/v1/query`,
        {
            BusinessShortCode: MPESA.SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            CheckoutRequestID: checkoutRequestId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return { resultCode: data.ResultCode, resultDesc: data.ResultDesc };
};

module.exports = {
    stripe: { createPaymentIntent: createStripePaymentIntent, confirmPayment: confirmStripePayment, refund: refundStripePayment },
    mpesa: { stkPush, queryStkStatus },
};