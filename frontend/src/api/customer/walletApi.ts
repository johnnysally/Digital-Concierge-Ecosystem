import axiosClient from '../axios';

export const getWallet = () =>
    axiosClient.get('/customer/wallet');

export const topUp = (data: { amount: number; method: string }) =>
    axiosClient.post('/customer/wallet/topup', data);

export const addPaymentMethod = (data: any) =>
    axiosClient.post('/customer/wallet/methods', data);

export const removePaymentMethod = (id: string) =>
    axiosClient.delete(`/customer/wallet/methods/${id}`);