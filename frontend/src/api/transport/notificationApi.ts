import { api } from '../axios';

export const getNotifications = async () => {
    const res = await api.get('/transport/notifications');
    return res.data;
};

export const markAsRead = async (id: string) => {
    const res = await api.put(`/transport/notifications/${id}/read`);
    return res.data;
};

export const markAllAsRead = async () => {
    const res = await api.put('/transport/notifications/read-all');
    return res.data;
};

export const deleteNotification = async (id: string) => {
    const res = await api.delete(`/transport/notifications/${id}`);
    return res.data;
};