import { api } from '../axios';

export const getPromotions = async (params?: any) => {
    const res = await api.get('/transport/promotions', { params });
    return res.data;
};

export const getPromotion = async (id: string) => {
    const res = await api.get(`/transport/promotions/${id}`);
    return res.data;
};

export const createPromotion = async (data: any) => {
    const res = await api.post('/transport/promotions', data);
    return res.data;
};

export const updatePromotion = async (id: string, data: any) => {
    const res = await api.put(`/transport/promotions/${id}`, data);
    return res.data;
};

export const deletePromotion = async (id: string) => {
    const res = await api.delete(`/transport/promotions/${id}`);
    return res.data;
};