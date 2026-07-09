import { api } from '../axios';

export const createStripePayment = async (data: any) => {
    const res = await api.post('/customer/payments/stripe', data);
    return res.data;
};

export const confirmStripePayment = async (data: any) => {
    const res = await api.post('/customer/payments/stripe/confirm', data);
    return res.data;
};

export const initiateMpesaPayment = async (data: any) => {
    const res = await api.post('/customer/payments/mpesa', data);
    return res.data;
};

export const getPaymentHistory = async (params?: any) => {
    const res = await api.get('/customer/payments', { params });
    return res.data;
};