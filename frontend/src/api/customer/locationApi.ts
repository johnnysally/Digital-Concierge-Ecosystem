import { api } from '../axios';

export const getTowns = async () => {
    const res = await api.get('/public/towns');
    return res.data;
};

export const getDestinations = async (townId?: string) => {
    const res = await api.get('/public/destinations', { params: townId ? { town: townId } : {} });
    return res.data;
};