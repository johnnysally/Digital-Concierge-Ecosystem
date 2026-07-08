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
