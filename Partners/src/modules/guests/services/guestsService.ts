import axios from 'axios';
import { Guest } from '../types';

const BASE = '/api/partners/accommodation/guests';

export async function fetchGuests(): Promise<Guest[]> {
  const { data } = await axios.get(BASE);
  return data;
}

export async function fetchGuest(id: string): Promise<Guest> {
  const { data } = await axios.get(`${BASE}/${id}`);
  return data;
}

export async function updateGuest(id: string, payload: Partial<Guest>) {
  const { data } = await axios.put(`${BASE}/${id}`, payload);
  return data;
}
