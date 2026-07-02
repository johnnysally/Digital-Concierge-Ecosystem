import { fetchMenu as fetchMenuApi } from '../../../../shared/services/restaurantService';

export async function fetchMenu() {
  return fetchMenuApi();
}
