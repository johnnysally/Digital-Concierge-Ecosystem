import axios from 'axios';
import { Property } from '../types';

const API_BASE = '/api/partners/accommodation/property';

export async function fetchProperties(): Promise<Property[]> {
  const { data } = await axios.get(API_BASE);
  return data;
}

export async function fetchProperty(id: string): Promise<Property> {
  const { data } = await axios.get(`${API_BASE}/${id}`);
  return data;
}

export async function saveProperty(payload: Partial<Property>) {
  const { data } = await axios.post(API_BASE, payload);
  return data;
}

export async function updateProperty(id: string, payload: Partial<Property>) {
  const { data } = await axios.put(`${API_BASE}/${id}`, payload);
  return data;
}
