import axios from 'axios';
import { Payout, Transaction } from '../types';

const BASE = '/api/partners/accommodation/payments';

export async function fetchPayouts(): Promise<Payout[]> {
  const { data } = await axios.get(`${BASE}/payouts`);
  return data;
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const { data } = await axios.get(`${BASE}/transactions`);
  return data;
}
