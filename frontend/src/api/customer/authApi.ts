import { api } from '../axios';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
}

export const login = async (payload: LoginPayload) => {
    const res = await api.post('/customer/auth/login', payload);
    return res.data;
};

export const register = async (payload: RegisterPayload) => {
    const res = await api.post('/customer/auth/register', payload);
    return res.data;
};

export const getProfile = async () => {
    const res = await api.get('/customer/auth/profile');
    return res.data.user;
};

export const updateProfile = async (data: any) => {
    const res = await api.put('/customer/auth/profile', data);
    return res.data.user;
};

export const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
    const res = await api.put('/customer/auth/change-password', data);
    return res.data;
};

export const forgotPassword = async (data: { email: string }) => {
    const res = await api.post('/customer/auth/forgot-password', data);
    return res.data;
};

export const resetPassword = async (data: { token: string; newPassword: string }) => {
    const res = await api.post('/customer/auth/reset-password', data);
    return res.data;
};

export const deleteAccount = async () => {
    const res = await api.delete('/customer/auth/account');
    return res.data;
};