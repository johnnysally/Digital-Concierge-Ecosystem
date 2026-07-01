import axios from 'axios';

const BASE = '/api/partners/accommodation/ai';

export async function getAiInsight(query: string) {
  const { data } = await axios.get(`${BASE}/insight`, { params: { q: query } });
  return data;
}

export async function requestPriceRecommendation(payload: any) {
  const { data } = await axios.post(`${BASE}/pricing/recommend`, payload);
  return data;
}
