import apiClient from '../api/axiosClient';

export interface TravelerProfile {
  name: string;
  relation: string;
  status: string;
  lastTrip: string;
}

export interface Promotion {
  title: string;
  description: string;
  tag: string;
}

export async function fetchTravelerProfiles(): Promise<TravelerProfile[]> {
  const { data } = await apiClient.get<TravelerProfile[]>('/traveler-profiles');
  return data;
}

export async function fetchPromotions(): Promise<Promotion[]> {
  const { data } = await apiClient.get<Promotion[]>('/promotions');
  return data;
}
