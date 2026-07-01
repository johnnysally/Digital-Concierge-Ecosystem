import axios from 'axios';

const BASE = '/api/partners/accommodation/notifications';

export async function fetchNotifications() {
  const { data } = await axios.get(BASE);
  return data;
}

export async function markRead(id: string) {
  const { data } = await axios.post(`${BASE}/${id}/read`);
  return data;
}
