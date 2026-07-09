import { api } from '../axios';

export const sendMessage = async (data: { message: string }) => {
    const res = await api.post('/customer/chat', data);
    return res.data;
};

export const getChatHistory = async (params?: any) => {
    const res = await api.get('/customer/chat', { params });
    return res.data;
};