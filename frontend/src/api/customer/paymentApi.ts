import axiosClient from '../axios';

export const createStripePayment = (data: any) =>
    axiosClient.post('/customer/payments/stripe', data);

export const confirmStripePayment = (data: any) =>
    axiosClient.post('/customer/payments/stripe/confirm', data);

export const initiateMpesaPayment = (data: any) =>
    axiosClient.post('/customer/payments/mpesa', data);

export const getPaymentHistory = (params?: any) =>
    axiosClient.get('/customer/payments', { params });