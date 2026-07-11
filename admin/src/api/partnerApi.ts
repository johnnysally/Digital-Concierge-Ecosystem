import { api } from './axios';

export const getAllPartners = async (params?: any) => {
    const res = await api.get('/admin/partners', { params });
    return res.data;
};

export const getPartner = async (id: string) => {
    const res = await api.get(`/admin/partners/${id}`);
    return res.data;
};

export const approvePartner = async (id: string) => {
    const res = await api.put(`/admin/partners/${id}/approve`);
    return res.data;
};

export const suspendPartner = async (id: string) => {
    const res = await api.put(`/admin/partners/${id}/suspend`);
    return res.data;
};

export const activatePartner = async (id: string) => {
    const res = await api.put(`/admin/partners/${id}/activate`);
    return res.data;
};

export const deletePartner = async (id: string) => {
    const res = await api.delete(`/admin/partners/${id}`);
    return res.data;
};