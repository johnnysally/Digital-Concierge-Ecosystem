import axios from 'axios';
import { Reservation } from '../types';

const BASE = '/api/partners/accommodation/reservations';

export async function fetchReservations(): Promise<Reservation[]> {
  const { data } = await axios.get(BASE);
  return data;
}

export async function fetchReservation(id: string): Promise<Reservation> {
  const { data } = await axios.get(`${BASE}/${id}`);
  return data;
}

export async function updateReservation(id: string, payload: Partial<Reservation>) {
  const { data } = await axios.put(`${BASE}/${id}`, payload);
  return data;
}

export async function cancelReservation(id: string) {
  const { data } = await axios.post(`${BASE}/${id}/cancel`);
  return data;
}
