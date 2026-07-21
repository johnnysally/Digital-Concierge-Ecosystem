import { api } from '../axios';

export const getSettings = async () => {
    const res = await api.get('/transport/settings');
    return res.data;
};

export const updateSettings = async (data: any) => {
    const res = await api.put('/transport/settings', data);
    return res.data;
};