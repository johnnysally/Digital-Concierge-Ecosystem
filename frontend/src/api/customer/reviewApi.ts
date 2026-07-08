import axiosClient from '../axios';

export const createReview = (data: any) =>
    axiosClient.post('/customer/reviews', data);

export const getPropertyReviews = (propertyId: string, params?: any) =>
    axiosClient.get(`/customer/reviews/property/${propertyId}`, { params });

export const getMyReviews = () =>
    axiosClient.get('/customer/reviews');