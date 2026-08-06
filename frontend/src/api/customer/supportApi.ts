import { api } from '../axios';

export const getTickets = async () => {
    const res = await api.get('/customer/support');
    return res.data;
};

export const createTicket = async (data: { subject: string; description: string; priority?: string }) => {
    const res = await api.post('/customer/support', data);
    return res.data;
};

export const getTicket = async (id: string) => {
    const res = await api.get(`/customer/support/${id}`);
    return res.data;
};