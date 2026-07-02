import { fetchEarnings as fetchEarningsApi } from '../../../../shared/services/transportService';

export async function fetchEarnings(riderId: string) {
  return fetchEarningsApi(riderId);
}
