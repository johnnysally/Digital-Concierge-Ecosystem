import { fetchDeliveries as fetchDeliveriesApi, acceptDelivery as acceptDeliveryApi, updateDeliveryStatus as updateDeliveryStatusApi } from '../../../../shared/services/transportService';

export async function fetchDeliveries(riderId: string) {
  return fetchDeliveriesApi(riderId);
}

export async function acceptDelivery(deliveryId: string) {
  return acceptDeliveryApi(deliveryId);
}

export async function updateDeliveryStatus(deliveryId: string, status: string) {
  return updateDeliveryStatusApi(deliveryId, status);
}
