import { api } from '../axios';

export const createStaff = async (data: any) => {
    const res = await api.post('/accommodation/staff', data);
    return res.data;
};

export const getStaff = async (params?: any) => {
    const res = await api.get('/accommodation/staff', { params });
    return res.data;
};

export const getStaffMember = async (id: string) => {
    const res = await api.get(`/accommodation/staff/${id}`);
    return res.data;
};

export const updateStaff = async (id: string, data: any) => {
    const res = await api.put(`/accommodation/staff/${id}`, data);
    return res.data;
};

export const deleteStaff = async (id: string) => {
    const res = await api.delete(`/accommodation/staff/${id}`);
    return res.data;
};