<<<<<<< HEAD
import { apiClient } from "../axiosClient";
import { WalletTransaction } from "../../types/customer";

export async function getWallet(): Promise<{ balance: number; currency: string }> {
  const response = await apiClient.get<{ balance: number; currency: string }>("/customer/wallet");
  return response.data;
}

export async function getWalletTransactions(): Promise<WalletTransaction[]> {
  const response = await apiClient.get<{ transactions: WalletTransaction[] }>("/customer/wallet/transactions");
  return response.data.transactions;
}
=======
import axiosClient from '../axios';

export const getWallet = () =>
    axiosClient.get('/customer/wallet');

export const topUp = (data: { amount: number; method: string }) =>
    axiosClient.post('/customer/wallet/topup', data);

export const addPaymentMethod = (data: any) =>
    axiosClient.post('/customer/wallet/methods', data);

export const removePaymentMethod = (id: string) =>
    axiosClient.delete(`/customer/wallet/methods/${id}`);
>>>>>>> 6b5aaf6aca0fff1fc0de1f47e6162024c378b818
