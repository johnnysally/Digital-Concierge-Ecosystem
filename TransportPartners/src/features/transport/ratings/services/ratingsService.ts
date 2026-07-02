import { fetchRatings as fetchRatingsApi } from '../../../../shared/services/transportService';

export async function fetchRatings(riderId: string) {
  return fetchRatingsApi(riderId);
}
