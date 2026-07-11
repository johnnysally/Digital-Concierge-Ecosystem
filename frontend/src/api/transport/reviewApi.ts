import { api } from '../axios';

export const getReviews = async (params?: any) => {
    const res = await api.get('/transport/reviews', { params });
    return res.data;
};

export const getReview = async (id: string) => {
    const res = await api.get(`/transport/reviews/${id}`);
    return res.data;
};