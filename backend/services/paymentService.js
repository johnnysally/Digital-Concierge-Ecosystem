const { STRIPE, MPESA } = require('../config/env');
const logger = require('../utils/logger');
const axios = require('axios');

let stripe;
if (STRIPE.SECRET_KEY) {
    stripe = require('stripe')(STRIPE.SECRET_KEY);
}

const getMpesaBaseUrl = () => {
    return MPESA.ENV === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke';
};

const createStripePaymentIntent = async ({ amount, currency = 'kes', metadata = {} }) => {
    try {
        if (!stripe) { const e = new Error('Stripe not configured'); e.statusCode = 502; throw e; }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), currency, metadata,
        });
        return { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id };
    } catch (error) {
        if (error.statusCode) throw error;
        logger.error(`Stripe failed: ${error.message}`);
        const e = new Error('Payment service unavailable'); e.statusCode = 502; throw e;
    }
};

const confirmStripePayment = async (paymentIntentId) => {
    try {
        if (!stripe) { const e = new Error('Stripe not configured'); e.statusCode = 502; throw e; }
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        return { status: paymentIntent.status, paymentIntentId };
    } catch (error) {
        logger.error(`Stripe confirm failed: ${error.message}`);
        const e = new Error('Unable to verify payment'); e.statusCode = 502; throw e;
    }
};

const refundStripePayment = async (paymentIntentId, amount) => {
    try {
        if (!stripe) { const e = new Error('Stripe not configured'); e.statusCode = 502; throw e; }
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: amount ? Math.round(amount * 100) : undefined,
        });
        return { refundId: refund.id, status: refund.status };
    } catch (error) {
        logger.error(`Stripe refund failed: ${error.message}`);
        const e = new Error('Refund failed'); e.statusCode = 502; throw e;
    }
};

const getMpesaAuthToken = async () => {
    try {
        if (!MPESA.CONSUMER_KEY || !MPESA.CONSUMER_SECRET) {
            const error = new Error('M-Pesa not configured. Check Consumer Key and Secret.');
            error.statusCode = 502; throw error;
        }
        const auth = Buffer.from(`${MPESA.CONSUMER_KEY}:${MPESA.CONSUMER_SECRET}`).toString('base64');
        const baseUrl = getMpesaBaseUrl();
        const { data } = await axios.get(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
            headers: { Authorization: `Basic ${auth}` },
        });
        return data.access_token;
    } catch (error) {
        if (error.statusCode) throw error;
        if (error.response) {
            logger.error(`M-Pesa Auth Failed - Status: ${error.response.status}, Body: ${JSON.stringify(error.response.data)}`);
            if (error.response.status === 401) {
                const e = new Error('Invalid M-Pesa credentials. Check Consumer Key and Secret.');
                e.statusCode = 502; throw e;
            }
        }
        logger.error(`M-Pesa auth error: ${error.message}`);
        const e = new Error('M-Pesa service unavailable.'); e.statusCode = 503; throw e;
    }
};

const stkPush = async ({ phone, amount, reference, description }) => {
    try {
        if (!MPESA.PASSKEY || !MPESA.SHORTCODE) {
            const error = new Error('M-Pesa not configured. Check Passkey and Shortcode.');
            error.statusCode = 502; throw error;
        }
        const token = await getMpesaAuthToken();
        const baseUrl = getMpesaBaseUrl();
        const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
        const password = Buffer.from(`${MPESA.SHORTCODE}${MPESA.PASSKEY}${timestamp}`).toString('base64');
        const formattedPhone = phone.replace(/^0/, '254').replace(/^\+254/, '254');

        const payload = {
            BusinessShortCode: MPESA.SHORTCODE, Password: password, Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline', Amount: Math.round(amount),
            PartyA: formattedPhone, PartyB: MPESA.SHORTCODE, PhoneNumber: formattedPhone,
            CallBackURL: MPESA.CALLBACK_URL,
            AccountReference: (reference || 'Payment').substring(0, 12),
            TransactionDesc: (description || 'Digital Safaris Payment').substring(0, 13),
        };

        logger.info(`M-Pesa STK: Phone=${formattedPhone} Amount=${amount}`);

        const { data } = await axios.post(`${baseUrl}/mpesa/stkpush/v1/processrequest`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });

        logger.info(`M-Pesa STK Response: ${JSON.stringify(data)}`);

        if (data.ResponseCode !== '0') {
            const e = new Error(data.ResponseDescription || 'M-Pesa request rejected');
            e.statusCode = 402; throw e;
        }

        return { checkoutRequestId: data.CheckoutRequestID, responseCode: data.ResponseCode, responseDescription: data.ResponseDescription };
    } catch (error) {
        if (error.statusCode) throw error;
        if (error.response) {
            logger.error(`M-Pesa STK Failed - Status: ${error.response.status}, Body: ${JSON.stringify(error.response.data)}`);
            if (error.response.status === 500) {
                const e = new Error('M-Pesa service unavailable.'); e.statusCode = 503; throw e;
            }
        }
        logger.error(`M-Pesa STK error: ${error.message}`);
        const e = new Error('Payment failed. M-Pesa request could not be completed.');
        e.statusCode = 402; throw e;
    }
};

const queryStkStatus = async (checkoutRequestId) => {
    try {
        const token = await getMpesaAuthToken();
        const baseUrl = getMpesaBaseUrl();
        const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
        const password = Buffer.from(`${MPESA.SHORTCODE}${MPESA.PASSKEY}${timestamp}`).toString('base64');

        const { data } = await axios.post(`${baseUrl}/mpesa/stkpushquery/v1/query`, {
            BusinessShortCode: MPESA.SHORTCODE, Password: password, Timestamp: timestamp, CheckoutRequestID: checkoutRequestId,
        }, { headers: { Authorization: `Bearer ${token}` } });

        return { resultCode: data.ResultCode, resultDesc: data.ResultDesc };
    } catch (error) {
        logger.error(`M-Pesa query failed: ${error.message}`);
        const e = new Error('Unable to verify payment'); e.statusCode = 502; throw e;
    }
};

module.exports = {
    stripe: { createPaymentIntent: createStripePaymentIntent, confirmPayment: confirmStripePayment, refund: refundStripePayment },
    mpesa: { stkPush, queryStkStatus },
};