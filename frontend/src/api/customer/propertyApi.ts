import { api } from '../axios';

export const searchProperties = async (params?: any) => {
    const res = await api.get('/public/properties', { params });
    return res.data;
};

export const getProperty = async (id: string) => {
    const res = await api.get(`/public/properties/${id}`);
    return res.data;
};