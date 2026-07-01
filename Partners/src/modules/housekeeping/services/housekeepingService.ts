import axios from 'axios';
import { HousekeepingTask } from '../types';

const BASE = '/api/partners/accommodation/housekeeping';

export async function fetchTasks(): Promise<HousekeepingTask[]> {
  const { data } = await axios.get(BASE + '/tasks');
  return data;
}

export async function assignTask(id: string, staffId: string) {
  const { data } = await axios.post(`${BASE}/tasks/${id}/assign`, { staffId });
  return data;
}

export async function completeTask(id: string) {
  const { data } = await axios.post(`${BASE}/tasks/${id}/complete`);
  return data;
}
