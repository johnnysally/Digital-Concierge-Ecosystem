import { api } from '../axios';

export const createBooking = async (data: any) => {
    const res = await api.post('/customer/bookings', data);
    return res.data;
};

export const getMyBookings = async (params?: any) => {
    const res = await api.get('/customer/bookings', { params });
    return res.data;
};

export const getBooking = async (id: string) => {
    const res = await api.get(`/customer/bookings/${id}`);
    return res.data;
};

export const cancelBooking = async (id: string, reason?: string) => {
    const res = await api.put(`/customer/bookings/${id}/cancel`, { reason });
    return res.data;
};