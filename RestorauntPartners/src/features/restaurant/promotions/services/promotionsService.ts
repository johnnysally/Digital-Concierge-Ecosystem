import { fetchPromotions as fetchPromotionsApi, createPromotion as createPromotionApi } from '../../../../shared/services/restaurantService';
import type { Promotion } from '../../../shared/types/restaurant';

export async function fetchPromotions() {
  return fetchPromotionsApi();
}

export async function createPromotion(payload: Partial<Promotion>) {
  return createPromotionApi(payload);
}
