import { api } from '../axios';

export const createDocument = async (data: any) => {
    const res = await api.post('/accommodation/documents', data);
    return res.data;
};

export const getDocuments = async (params?: any) => {
    const res = await api.get('/accommodation/documents', { params });
    return res.data;
};

export const getDocument = async (id: string) => {
    const res = await api.get(`/accommodation/documents/${id}`);
    return res.data;
};

export const updateDocument = async (id: string, data: any) => {
    const res = await api.put(`/accommodation/documents/${id}`, data);
    return res.data;
};

export const deleteDocument = async (id: string) => {
    const res = await api.delete(`/accommodation/documents/${id}`);
    return res.data;
};