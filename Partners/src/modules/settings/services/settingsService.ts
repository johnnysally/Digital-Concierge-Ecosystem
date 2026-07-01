import axios from 'axios';

const BASE = '/api/partners/accommodation/settings';

export async function fetchSettings() {
  const { data } = await axios.get(BASE);
  return data;
}

export async function updateSettings(payload: any) {
  const { data } = await axios.put(BASE, payload);
  return data;
}
