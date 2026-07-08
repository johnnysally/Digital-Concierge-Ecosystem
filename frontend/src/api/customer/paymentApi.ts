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
