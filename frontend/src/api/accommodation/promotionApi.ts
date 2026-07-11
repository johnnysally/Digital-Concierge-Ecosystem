import { api } from '../axios';

export const createPromotion = async (data: any) => {
    const res = await api.post('/accommodation/promotions', data);
    return res.data;
};

export const getPromotions = async (params?: any) => {
    const res = await api.get('/accommodation/promotions', { params });
    return res.data;
};

export const getPromotion = async (id: string) => {
    const res = await api.get(`/accommodation/promotions/${id}`);
    return res.data;
};

export const updatePromotion = async (id: string, data: any) => {
    const res = await api.put(`/accommodation/promotions/${id}`, data);
    return res.data;
};

export const deletePromotion = async (id: string) => {
    const res = await api.delete(`/accommodation/promotions/${id}`);
    return res.data;
};