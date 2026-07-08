<<<<<<< HEAD
import { apiClient } from "../axiosClient";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getPaymentHistory() {
  await delay(450);
  const response = await apiClient.get("/customer/payments");
  return response.data.payments;
}

export async function processPayment(payload: { amount: number; method: string }) {
  await delay(500);
  const response = await apiClient.post("/customer/payments", payload);
  return response.data;
}
=======
import axiosClient from '../axios';

export const createStripePayment = (data: any) =>
    axiosClient.post('/customer/payments/stripe', data);

export const confirmStripePayment = (data: any) =>
    axiosClient.post('/customer/payments/stripe/confirm', data);

export const initiateMpesaPayment = (data: any) =>
    axiosClient.post('/customer/payments/mpesa', data);

export const getPaymentHistory = (params?: any) =>
    axiosClient.get('/customer/payments', { params });
>>>>>>> 6b5aaf6aca0fff1fc0de1f47e6162024c378b818
