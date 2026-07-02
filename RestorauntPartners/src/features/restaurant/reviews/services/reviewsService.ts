import { fetchReviews as fetchReviewsApi } from '../../../../shared/services/restaurantService';

export async function fetchReviews() {
  return fetchReviewsApi();
}
