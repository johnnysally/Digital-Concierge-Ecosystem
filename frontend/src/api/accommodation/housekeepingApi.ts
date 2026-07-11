import { api } from '../axios';

export const createTask = async (data: any) => {
    const res = await api.post('/accommodation/housekeeping', data);
    return res.data;
};

export const getTasks = async (params?: any) => {
    const res = await api.get('/accommodation/housekeeping', { params });
    return res.data;
};

export const updateTask = async (id: string, data: any) => {
    const res = await api.put(`/accommodation/housekeeping/${id}`, data);
    return res.data;
};

export const deleteTask = async (id: string) => {
    const res = await api.delete(`/accommodation/housekeeping/${id}`);
    return res.data;
};