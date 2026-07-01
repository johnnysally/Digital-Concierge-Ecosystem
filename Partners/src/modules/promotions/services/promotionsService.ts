import axios from 'axios';
import { Promotion } from '../types';

const BASE = '/api/partners/accommodation/promotions';

export async function fetchPromotions(): Promise<Promotion[]> {
  const { data } = await axios.get(BASE);
  return data;
}

export async function createPromotion(payload: Partial<Promotion>) {
  const { data } = await axios.post(BASE, payload);
  return data;
}
