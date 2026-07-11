import { api } from './axios';

export const getAllDisputes = async (params?: any) => {
    const res = await api.get('/admin/disputes', { params });
    return res.data;
};

export const getDispute = async (id: string) => {
    const res = await api.get(`/admin/disputes/${id}`);
    return res.data;
};

export const updateDispute = async (id: string, data: any) => {
    const res = await api.put(`/admin/disputes/${id}`, data);
    return res.data;
};