import { api } from '../axios';

export const getVehicles = async (params?: any) => {
    const res = await api.get('/transport/vehicles', { params });
    return res.data;
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

export const toggleAvailability = async (id: string) => {
    const res = await api.put(`/transport/vehicles/${id}/toggle-availability`);
    return res.data;
};

export const updateDispatchStatus = async (id: string, data: { dispatchStatus: string }) => {
    const res = await api.put(`/transport/vehicles/${id}/dispatch`, data);
    return res.data;
};

export const addMaintenanceRecord = async (id: string, data: any) => {
    const res = await api.post(`/transport/vehicles/${id}/maintenance`, data);
    return res.data;
};

export const getMaintenanceHistory = async (id: string) => {
    const res = await api.get(`/transport/vehicles/${id}/maintenance`);
    return res.data;
};

export const uploadImages = async (formData: FormData) => {
    const res = await api.post('/transport/vehicles/upload-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};