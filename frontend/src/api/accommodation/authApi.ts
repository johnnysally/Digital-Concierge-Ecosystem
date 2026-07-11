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
    businessName: string;
    businessType?: string;
}

export const login = async (payload: LoginPayload) => {
    const res = await api.post('/accommodation/auth/login', payload);
    return res.data;
};

export const register = async (payload: RegisterPayload) => {
    const res = await api.post('/accommodation/auth/register', payload);
    return res.data;
};

export const getProfile = async () => {
    const res = await api.get('/accommodation/auth/profile');
    return res.data.user;
};

export const updateProfile = async (data: any) => {
    const res = await api.put('/accommodation/auth/profile', data);
    return res.data.user;
};

export const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
    const res = await api.put('/accommodation/auth/change-password', data);
    return res.data;
};

export const forgotPassword = async (data: { email: string }) => {
    const res = await api.post('/accommodation/auth/forgot-password', data);
    return res.data;
};

export const resetPassword = async (data: { token: string; newPassword: string }) => {
    const res = await api.post('/accommodation/auth/reset-password', data);
    return res.data;
};