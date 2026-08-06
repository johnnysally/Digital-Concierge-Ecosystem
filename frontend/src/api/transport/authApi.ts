import { api } from '../axios';

export const login = async (data: { email: string; password: string }) => {
    const res = await api.post('/transport/auth/login', data);
    return res.data;
};

export const register = async (data: any) => {
    const res = await api.post('/transport/auth/register', data);
    return res.data;
};

export const getProfile = async () => {
    const res = await api.get('/transport/auth/profile');
    return res.data;
};

export const updateProfile = async (data: any) => {
    const res = await api.put('/transport/auth/profile', data);
    return res.data;
};

export const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
    const res = await api.put('/transport/auth/change-password', data);
    return res.data;
};

export const forgotPassword = async (email: string) => {
    const res = await api.post('/transport/auth/forgot-password', { email });
    return res.data;
};

export const resetPassword = async (data: { token: string; newPassword: string }) => {
    const res = await api.post('/transport/auth/reset-password', data);
    return res.data;
};

export const sendOTP = async () => {
    const res = await api.post('/transport/auth/send-otp');
    return res.data;
};

export const verifyOTP = async (otp: string) => {
    const res = await api.post('/transport/auth/verify-otp', { otp });
    return res.data;
};