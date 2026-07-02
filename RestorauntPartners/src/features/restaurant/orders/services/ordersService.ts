import {
  fetchOrders as fetchOrdersApi,
  updateOrderStatus as updateOrderStatusApi,
} from '../../../../shared/services/restaurantService';

export async function fetchOrders() {
  return fetchOrdersApi();
}

export async function updateOrderStatus(orderId: string, status: string) {
  return updateOrderStatusApi(orderId, status);
}
