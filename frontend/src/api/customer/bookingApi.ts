import axiosClient from '../axios';

export const createBooking = (data: any) =>
    axiosClient.post('/customer/bookings', data);

export const getMyBookings = (params?: any) =>
    axiosClient.get('/customer/bookings', { params });

export const getBooking = (id: string) =>
    axiosClient.get(`/customer/bookings/${id}`);

export const cancelBooking = (id: string, reason?: string) =>
    axiosClient.put(`/customer/bookings/${id}/cancel`, { reason });