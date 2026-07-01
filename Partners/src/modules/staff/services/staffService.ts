import axios from 'axios';
import { Staff } from '../types';

const BASE = '/api/partners/accommodation/staff';

export async function fetchStaff(): Promise<Staff[]> {
  const { data } = await axios.get(BASE);
  return data;
}

export async function createStaff(payload: Partial<Staff>) {
  const { data } = await axios.post(BASE, payload);
  return data;
}

export async function updateStaff(id: string, payload: Partial<Staff>) {
  const { data } = await axios.put(`${BASE}/${id}`, payload);
  return data;
}
