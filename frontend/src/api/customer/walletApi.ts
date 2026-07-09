import { api } from '../axios';

export const getWallet = async () => {
    const res = await api.get('/customer/wallet');
    return res.data;
};

export const topUp = async (data: { amount: number; method: string }) => {
    const res = await api.post('/customer/wallet/topup', data);
    return res.data;
};

export const addPaymentMethod = async (data: any) => {
    const res = await api.post('/customer/wallet/methods', data);
    return res.data;
};

export const removePaymentMethod = async (id: string) => {
    const res = await api.delete(`/customer/wallet/methods/${id}`);
    return res.data;
};