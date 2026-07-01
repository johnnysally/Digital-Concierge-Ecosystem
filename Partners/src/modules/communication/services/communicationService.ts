import axios from 'axios';

const BASE = '/api/partners/accommodation/communication';

export async function sendMessage(payload: { to: string; message: string }) {
  const { data } = await axios.post(`${BASE}/messages`, payload);
  return data;
}

export async function fetchMessages(threadId: string) {
  const { data } = await axios.get(`${BASE}/threads/${threadId}/messages`);
  return data;
}
