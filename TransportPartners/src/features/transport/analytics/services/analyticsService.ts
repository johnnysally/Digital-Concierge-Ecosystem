import { fetchAnalytics as fetchAnalyticsApi } from '../../../../shared/services/transportService';

export async function fetchAnalytics(riderId: string) {
  return fetchAnalyticsApi(riderId);
}
