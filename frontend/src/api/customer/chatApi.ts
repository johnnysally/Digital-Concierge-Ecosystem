import axiosClient from '../axios';

export const sendMessage = (data: { message: string }) =>
    axiosClient.post('/customer/chat', data);

export const getChatHistory = (params?: any) =>
    axiosClient.get('/customer/chat', { params });