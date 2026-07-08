import axiosClient from '../axios';

export const register = (data: { firstName: string; lastName: string; email: string; password: string; phone?: string }) =>
    axiosClient.post('/customer/auth/register', data);

export const login = (data: { email: string; password: string }) =>
    axiosClient.post('/customer/auth/login', data);

export const getProfile = () =>
    axiosClient.get('/customer/auth/profile');

export const updateProfile = (data: any) =>
    axiosClient.put('/customer/auth/profile', data);

export const changePassword = (data: { currentPassword: string; newPassword: string }) =>
    axiosClient.put('/customer/auth/change-password', data);

export const forgotPassword = (data: { email: string }) =>
    axiosClient.post('/customer/auth/forgot-password', data);

export const resetPassword = (data: { token: string; newPassword: string }) =>
    axiosClient.post('/customer/auth/reset-password', data);