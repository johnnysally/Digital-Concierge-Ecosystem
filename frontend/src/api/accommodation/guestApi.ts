import { api } from '../axios';

export const getGuests = async () => {
    const res = await api.get('/accommodation/guests');
    return res.data;
};

export const getGuest = async (id: string) => {
    const res = await api.get(`/accommodation/guests/${id}`);
    return res.data;
};