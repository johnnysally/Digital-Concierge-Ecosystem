import { api } from '../axios';

export const getVehicles = async (params?: any) => {
    const res = await api.get('/public/vehicles', { params });
    return res.data;
};

export const getVehicle = async (id: string) => {
    const res = await api.get(`/public/vehicles/${id}`);
    return res.data;
};