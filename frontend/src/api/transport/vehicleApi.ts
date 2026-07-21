import { api } from '../axios';

export const getVehicles = async (params?: any) => {
    const res = await api.get('/transport/vehicles', { params });
    const data = res.data;
    return data.vehicles ?? data.items ?? data;
};

export const getVehicle = async (id: string) => {
    const res = await api.get(`/transport/vehicles/${id}`);
    return res.data;
};

export const createVehicle = async (data: any) => {
    const res = await api.post('/transport/vehicles', data);
    return res.data;
};

export const updateVehicle = async (id: string, data: any) => {
    const res = await api.put(`/transport/vehicles/${id}`, data);
    return res.data;
};

export const deleteVehicle = async (id: string) => {
    const res = await api.delete(`/transport/vehicles/${id}`);
    return res.data;
};