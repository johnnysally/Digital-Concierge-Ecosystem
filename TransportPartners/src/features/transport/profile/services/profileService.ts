import { fetchRiderProfile as fetchRiderProfileApi, updateRiderProfile as updateRiderProfileApi } from '../../../../shared/services/transportService';

export async function fetchRiderProfile(riderId: string) {
  return fetchRiderProfileApi(riderId);
}

export async function updateRiderProfile(riderId: string, data: any) {
  return updateRiderProfileApi(riderId, data);
}
