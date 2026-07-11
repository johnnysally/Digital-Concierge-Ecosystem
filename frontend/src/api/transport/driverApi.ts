import { api } from '../axios';

export const getDrivers = async (params?: any) => {
    const res = await api.get('/transport/drivers', { params });
    return res.data;
};

export const getDriver = async (id: string) => {
    const res = await api.get(`/transport/drivers/${id}`);
    return res.data;
};

export const createDriver = async (data: any) => {
    const res = await api.post('/transport/drivers', data);
    return res.data;
};

export const updateDriver = async (id: string, data: any) => {
    const res = await api.put(`/transport/drivers/${id}`, data);
    return res.data;
};

export const deleteDriver = async (id: string) => {
    const res = await api.delete(`/transport/drivers/${id}`);
    return res.data;
};