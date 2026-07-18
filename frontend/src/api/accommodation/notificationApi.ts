import { api } from '../axios';

export const getNotifications = async (params?: { page?: number; limit?: number; unreadOnly?: boolean }) => {
    const res = await api.get('/accommodation/notifications', { params });
    return res.data;
};

export const markNotificationRead = async (id: string) => {
    const res = await api.put(`/accommodation/notifications/${id}/read`);
    return res.data;
};

export const markAllNotificationsRead = async () => {
    const res = await api.put('/accommodation/notifications/read-all');
    return res.data;
};
