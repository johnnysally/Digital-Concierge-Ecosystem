import { api } from './axios';

export const getAllTransactions = async (params?: any) => {
    const res = await api.get('/admin/transactions', { params });
    return res.data;
};

export const getTransaction = async (id: string) => {
    const res = await api.get(`/admin/transactions/${id}`);
    return res.data;
};

export const refundTransaction = async (id: string) => {
    const res = await api.put(`/admin/transactions/${id}/refund`);
    return res.data;
};