import { fetchAnalytics as fetchAnalyticsApi } from '../../../../shared/services/restaurantService';

export async function fetchAnalytics() {
  return fetchAnalyticsApi();
}
