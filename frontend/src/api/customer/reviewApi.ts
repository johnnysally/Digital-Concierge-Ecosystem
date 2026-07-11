import { api } from '../axios';

export const createReview = async (data: any) => {
    const res = await api.post('/customer/reviews', data);
    return res.data;
};

export const getPropertyReviews = async (propertyId: string, params?: any) => {
    const res = await api.get(`/customer/reviews/property/${propertyId}`, { params });
    return res.data;
};

export const getMyReviews = async () => {
    const res = await api.get('/customer/reviews');
    return res.data;
};

export const updateReview = async (id: string, data: any) => {
    const res = await api.put(`/customer/reviews/${id}`, data);
    return res.data;
};

export const deleteReview = async (id: string) => {
    const res = await api.delete(`/customer/reviews/${id}`);
    return res.data;
};