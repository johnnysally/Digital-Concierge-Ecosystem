import { fetchDeliveryRequests as fetchDeliveryRequestsApi } from '../../../../shared/services/restaurantService';

export async function fetchDeliveryRequests() {
  return fetchDeliveryRequestsApi();
}
