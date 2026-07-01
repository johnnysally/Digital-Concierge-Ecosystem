import axios from 'axios';

const BASE = '/api/partners/accommodation/analytics';

export async function fetchOccupancyTrend(params?: any) {
  const { data } = await axios.get(`${BASE}/occupancy`, { params });
  return data;
}

export async function fetchRevenueTrend(params?: any) {
  const { data } = await axios.get(`${BASE}/revenue`, { params });
  return data;
}
