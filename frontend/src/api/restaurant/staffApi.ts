import { api } from '../axios';

export const getStaff = async (params?: any) => {
    const res = await api.get('/restaurant/staff', { params });
    return res.data;
};

export const getStaffMember = async (id: string) => {
    const res = await api.get(`/restaurant/staff/${id}`);
    return res.data;
};

export const createStaff = async (data: any) => {
    const res = await api.post('/restaurant/staff', data);
    return res.data;
};

export const updateStaff = async (id: string, data: any) => {
    const res = await api.put(`/restaurant/staff/${id}`, data);
    return res.data;
};

export const deleteStaff = async (id: string) => {
    const res = await api.delete(`/restaurant/staff/${id}`);
    return res.data;
};