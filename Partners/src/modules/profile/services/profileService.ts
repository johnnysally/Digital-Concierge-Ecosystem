import axios from 'axios';

const BASE = '/api/partners/accommodation/profile';

export async function fetchProfile() {
  const { data } = await axios.get(BASE);
  return data;
}

export async function updateProfile(payload: any) {
  const { data } = await axios.put(BASE, payload);
  return data;
}
