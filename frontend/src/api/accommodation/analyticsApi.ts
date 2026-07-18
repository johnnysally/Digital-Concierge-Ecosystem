import { api } from '../axios';

export const getAccommodationAnalytics = async () => {
    const res = await api.get('/accommodation/analytics');
    return res.data;
};
