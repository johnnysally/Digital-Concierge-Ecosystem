import { api } from '../axios';

export const getOrders = async (params?: any) => {
    const res = await api.get('/restaurant/orders', { params });
    return res.data;
};

export const getOrder = async (id: string) => {
    const res = await api.get(`/restaurant/orders/${id}`);
    return res.data;
};

export const updateOrderStatus = async (id: string, status: string) => {
    const res = await api.put(`/restaurant/orders/${id}/status`, { status });
    return res.data;
};

export const deleteOrder = async (id: string) => {
    const res = await api.delete(`/restaurant/orders/${id}`);
    return res.data;
};