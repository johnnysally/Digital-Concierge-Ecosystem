import { api } from '../axios';

export const getMenu = async (params?: any) => {
    const res = await api.get('/public/menu', { params });
    return res.data;
};

export const getMenuItem = async (id: string) => {
    const res = await api.get(`/public/menu/${id}`);
    return res.data;
};