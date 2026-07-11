import { api } from '../axios';

export const getPayments = async (params?: any) => {
    const res = await api.get('/restaurant/payments', { params });
    return res.data;
};

export const getPayment = async (id: string) => {
    const res = await api.get(`/restaurant/payments/${id}`);
    return res.data;
};