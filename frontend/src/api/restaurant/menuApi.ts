import { api } from '../axios';

export const getItems = async (params?: any) => {
    const res = await api.get('/restaurant/menu', { params });
    return res.data;
};

export const getItem = async (id: string) => {
    const res = await api.get(`/restaurant/menu/${id}`);
    return res.data;
};

export const createItem = async (data: any) => {
    const res = await api.post('/restaurant/menu', data);
    return res.data;
};

export const updateItem = async (id: string, data: any) => {
    const res = await api.put(`/restaurant/menu/${id}`, data);
    return res.data;
};

export const deleteItem = async (id: string) => {
    const res = await api.delete(`/restaurant/menu/${id}`);
    return res.data;
};