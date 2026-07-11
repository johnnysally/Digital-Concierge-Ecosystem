import { api } from './axios';

export const getAllSettings = async () => {
    const res = await api.get('/admin/settings');
    return res.data;
};

export const getSettingsByCategory = async (category: string) => {
    const res = await api.get(`/admin/settings/category/${category}`);
    return res.data;
};

export const updateSetting = async (key: string, value: any) => {
    const res = await api.put(`/admin/settings/${key}`, { value });
    return res.data;
};

export const bulkUpdateSettings = async (settings: { key: string; value: any }[]) => {
    const res = await api.post('/admin/settings/bulk', { settings });
    return res.data;
};

export const getCommissions = async () => {
    const res = await api.get('/admin/settings/commissions');
    return res.data;
};

export const updateCommission = async (type: string, data: any) => {
    const res = await api.put(`/admin/settings/commissions/${type}`, data);
    return res.data;
};

export const getPublicSettings = async () => {
    const res = await api.get('/admin/settings/public');
    return res.data;
};