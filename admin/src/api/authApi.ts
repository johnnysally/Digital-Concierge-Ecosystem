import { api } from './axios';

export const login = async (payload: { email: string; password: string }) => {
    const res = await api.post('/admin/auth/login', payload);
    return res.data;
};

export const getProfile = async () => {
    const res = await api.get('/admin/auth/profile');
    return res.data.user;
};

export const updateProfile = async (data: any) => {
    const res = await api.put('/admin/auth/profile', data);
    return res.data.user;
};

export const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
    const res = await api.put('/admin/auth/change-password', data);
    return res.data;
};