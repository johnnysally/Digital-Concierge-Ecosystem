import { fetchProfile as fetchProfileApi } from '../../../../shared/services/restaurantService';

export async function fetchProfile() {
  return fetchProfileApi();
}
