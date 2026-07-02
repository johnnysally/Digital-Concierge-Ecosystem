import { fetchDashboardMetrics as fetchDashboardMetricsApi } from '../../../../shared/services/restaurantService';

export async function fetchDashboardMetrics() {
  return fetchDashboardMetricsApi();
}
