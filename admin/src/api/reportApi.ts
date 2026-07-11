import { api } from './axios';

export const getDashboardStats = async () => {
    const res = await api.get('/admin/reports/dashboard');
    return res.data;
};

export const getRevenueReport = async (params?: any) => {
    const res = await api.get('/admin/reports/revenue', { params });
    return res.data;
};