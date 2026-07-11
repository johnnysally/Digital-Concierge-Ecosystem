import { api } from '../axios';

export const getPromotions = async (params?: any) => {
    const res = await api.get('/restaurant/promotions', { params });
    return res.data;
};

export const getPromotion = async (id: string) => {
    const res = await api.get(`/restaurant/promotions/${id}`);
    return res.data;
};

export const createPromotion = async (data: any) => {
    const res = await api.post('/restaurant/promotions', data);
    return res.data;
};

export const updatePromotion = async (id: string, data: any) => {
    const res = await api.put(`/restaurant/promotions/${id}`, data);
    return res.data;
};

export const deletePromotion = async (id: string) => {
    const res = await api.delete(`/restaurant/promotions/${id}`);
    return res.data;
};