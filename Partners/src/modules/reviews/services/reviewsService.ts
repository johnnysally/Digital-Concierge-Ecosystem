import axios from 'axios';
import { Review } from '../types';

const BASE = '/api/partners/accommodation/reviews';

export async function fetchReviews(): Promise<Review[]> {
  const { data } = await axios.get(BASE);
  return data;
}

export async function respondToReview(id: string, response: string) {
  const { data } = await axios.post(`${BASE}/${id}/response`, { response });
  return data;
}
