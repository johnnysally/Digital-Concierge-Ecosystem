import { api } from './axios';

export const getLegalPage = async (type: string) => {
    const res = await api.get(`/admin/legal/${type}`);
    return res.data;
};

export const updateLegalPage = async (type: string, content: string) => {
    const res = await api.put(`/admin/legal/${type}`, { content });
    return res.data;
};

export const getAllLegalPages = async () => {
    const res = await api.get('/admin/legal');
    return res.data;
};