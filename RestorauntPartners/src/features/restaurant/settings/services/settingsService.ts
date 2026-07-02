import { fetchSettings as fetchSettingsApi } from '../../../../shared/services/restaurantService';

export async function fetchSettings() {
  return fetchSettingsApi();
}
