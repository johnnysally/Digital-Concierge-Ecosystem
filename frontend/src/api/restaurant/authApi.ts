import { api } from '../axios';

export const login = async (payload: { email: string; password: string }) => {
    const res = await api.post('/restaurant/auth/login', payload);
    return res.data;
};

export const register = async (payload: any) => {
    const res = await api.post('/restaurant/auth/register', payload);
    return res.data;
};

export const getProfile = async () => {
    const res = await api.get('/restaurant/auth/profile');
    return res.data.user;
};

export const updateProfile = async (data: any) => {
    const res = await api.put('/restaurant/auth/profile', data);
    return res.data;
};

export const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
    const res = await api.put('/restaurant/auth/change-password', data);
    return res.data;
};