import { api } from '../axios';

export const getNotifications = async () => {
    const res = await api.get('/customer/notifications');
    return res.data;
};

export const markAsRead = async (id: string) => {
    const res = await api.put(`/customer/notifications/${id}/read`);
    return res.data;
};

export const markAllAsRead = async () => {
    const res = await api.put('/customer/notifications/read-all');
    return res.data;
};

export const deleteNotification = async (id: string) => {
    const res = await api.delete(`/customer/notifications/${id}`);
    return res.data;
};