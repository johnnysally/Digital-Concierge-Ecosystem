import { api } from '../axios';

export const getWallet = async () => {
    const res = await api.get('/customer/wallet');
    return res.data;
};

export const topUp = async (data: { amount: number; method: string; phone?: string }) => {
    const res = await api.post('/customer/wallet/topup', data);
    return res.data;
};

export const confirmTopUp = async (data: { paymentIntentId?: string; checkoutRequestId?: string }) => {
    const res = await api.post('/customer/wallet/topup/confirm', data);
    return res.data;
};

export const addPaymentMethod = async (data: any) => {
    const res = await api.post('/customer/wallet/methods', data);
    return res.data;
};

export const updatePaymentMethod = async (id: string, data: any) => {
    const res = await api.put(`/customer/wallet/methods/${id}`, data);
    return res.data;
};

export const removePaymentMethod = async (id: string) => {
    const res = await api.delete(`/customer/wallet/methods/${id}`);
    return res.data;
};