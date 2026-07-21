import { api } from '../axios';

export const getSupportInfo = async () => {
    const res = await api.get('/transport/support/info');
    return res.data;
};

export const createTicket = async (data: { subject: string; description: string; priority?: string }) => {
    const res = await api.post('/transport/support', data);
    return res.data;
};

export const getMyTickets = async () => {
    const res = await api.get('/transport/support');
    return res.data;
};

export const getTicket = async (id: string) => {
    const res = await api.get(`/transport/support/${id}`);
    return res.data;
};