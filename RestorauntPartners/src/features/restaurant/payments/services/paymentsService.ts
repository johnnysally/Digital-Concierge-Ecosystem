import { fetchPaymentsOverview as fetchPaymentsOverviewApi } from '../../../../shared/services/restaurantService';

export async function fetchPaymentsOverview() {
  return fetchPaymentsOverviewApi();
}
