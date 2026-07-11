import { api } from '../axios';

export const getReviews = async (params?: any) => {
    const res = await api.get('/restaurant/reviews', { params });
    return res.data;
};

export const getReview = async (id: string) => {
    const res = await api.get(`/restaurant/reviews/${id}`);
    return res.data;
};