import { api } from '../axios';

export const getRides = async (params?: any) => {
    const res = await api.get('/transport/rides', { params });
    const data = res.data;
    return data.rides ?? data.items ?? data;
};

export const getRidesWithMeta = async (params?: any) => {
    const res = await api.get('/transport/rides', { params });
    return res.data;
};

export const getRide = async (id: string) => {
    const res = await api.get(`/transport/rides/${id}`);
    return res.data;
};
export const updateRideStatus = async (id: string, status: string) => {
    const res = await api.put(`/transport/rides/${id}/status`, { status });
    return res.data;
};

export const deleteRide = async (id: string) => {
    const res = await api.delete(`/transport/rides/${id}`);
    return res.data;
};