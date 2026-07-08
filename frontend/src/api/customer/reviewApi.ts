<<<<<<< HEAD
import { apiClient } from "../axiosClient";
import { Review } from "../../types/customer";

export async function getReviews(): Promise<Review[]> {
  const response = await apiClient.get<{ reviews: Review[] }>("/customer/reviews");
  return response.data.reviews;
}
=======
import axiosClient from '../axios';

export const createReview = (data: any) =>
    axiosClient.post('/customer/reviews', data);

export const getPropertyReviews = (propertyId: string, params?: any) =>
    axiosClient.get(`/customer/reviews/property/${propertyId}`, { params });

export const getMyReviews = () =>
    axiosClient.get('/customer/reviews');
>>>>>>> 6b5aaf6aca0fff1fc0de1f47e6162024c378b818
