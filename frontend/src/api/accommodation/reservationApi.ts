import { api } from '../axios';

export const createReservation = async (data: any) => {
    const res = await api.post('/accommodation/reservations', data);
    return res.data;
};

export const getReservations = async (params?: any) => {
    const res = await api.get('/accommodation/reservations', { params });
    return res.data;
};

export const getReservation = async (id: string) => {
    const res = await api.get(`/accommodation/reservations/${id}`);
    return res.data;
};

export const updateReservationStatus = async (id: string, status: string) => {
    const res = await api.put(`/accommodation/reservations/${id}/status`, { status });
    return res.data;
};

export const deleteReservation = async (id: string) => {
    const res = await api.delete(`/accommodation/reservations/${id}`);
    return res.data;
};