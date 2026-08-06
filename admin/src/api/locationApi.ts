import { api } from './axios';

export const getTowns = async (params?: any) => {
    const res = await api.get('/admin/locations/towns', { params });
    return res.data;
};

export const createTown = async (data: { name: string; region?: string }) => {
    const res = await api.post('/admin/locations/towns', data);
    return res.data;
};

export const updateTown = async (id: string, data: any) => {
    const res = await api.put(`/admin/locations/towns/${id}`, data);
    return res.data;
};

export const deleteTown = async (id: string) => {
    const res = await api.delete(`/admin/locations/towns/${id}`);
    return res.data;
};

export const getDestinations = async (params?: any) => {
    const res = await api.get('/admin/locations/destinations', { params });
    return res.data;
};

export const createDestination = async (data: { town: string; name: string; type?: string }) => {
    const res = await api.post('/admin/locations/destinations', data);
    return res.data;
};

export const updateDestination = async (id: string, data: any) => {
    const res = await api.put(`/admin/locations/destinations/${id}`, data);
    return res.data;
};

export const deleteDestination = async (id: string) => {
    const res = await api.delete(`/admin/locations/destinations/${id}`);
    return res.data;
};