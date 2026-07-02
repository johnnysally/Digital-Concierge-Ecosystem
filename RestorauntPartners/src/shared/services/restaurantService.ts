import { axiosClient } from '../api/axiosClient';
import {
  Metric,
  Order,
  MenuCategory,
  Promotion,
  Review,
  AnalyticsInsight,
  Profile,
  Settings,
  NotificationItem,
  PaymentOverview,
  DeliveryRequest,
  AIAssistantResponse,
} from '../types/restaurant';

const BASE = '/api/partners/accommodation';

export async function fetchDashboardMetrics(): Promise<{ metrics: Metric[] }> {
  const { data } = await axiosClient.get(`${BASE}/dashboard`);
  return data;
}

export async function fetchOrders(): Promise<{ orders: Order[] }> {
  const { data } = await axiosClient.get(`${BASE}/orders`);
  return data;
}

export async function updateOrderStatus(orderId: string, status: string): Promise<Order> {
  const { data } = await axiosClient.put(`${BASE}/orders/${orderId}/status`, { status });
  return data;
}

export async function fetchMenu(): Promise<{ categories: MenuCategory[] }> {
  const { data } = await axiosClient.get(`${BASE}/menu`);
  return data;
}

export async function fetchPromotions(): Promise<{ promotions: Promotion[] }> {
  const { data } = await axiosClient.get(`${BASE}/promotions`);
  return data;
}

export async function createPromotion(payload: Partial<Promotion>): Promise<Promotion> {
  const { data } = await axiosClient.post(`${BASE}/promotions`, payload);
  return data;
}

export async function fetchReviews(): Promise<{ reviews: Review[] }> {
  const { data } = await axiosClient.get(`${BASE}/reviews`);
  return data;
}

export async function fetchAnalytics(): Promise<{ insights: AnalyticsInsight[] }> {
  const { data } = await axiosClient.get(`${BASE}/analytics`);
  return data;
}

export async function fetchProfile(): Promise<Profile> {
  const { data } = await axiosClient.get(`${BASE}/profile`);
  return data;
}

export async function fetchSettings(): Promise<Settings> {
  const { data } = await axiosClient.get(`${BASE}/settings`);
  return data;
}

export async function fetchNotifications(): Promise<{ notifications: NotificationItem[] }> {
  const { data } = await axiosClient.get(`${BASE}/notifications`);
  return data;
}

export async function markNotificationRead(id: string): Promise<NotificationItem> {
  const { data } = await axiosClient.post(`${BASE}/notifications/${id}/read`);
  return data;
}

export async function fetchPaymentsOverview(): Promise<PaymentOverview> {
  const { data } = await axiosClient.get(`${BASE}/payments/overview`);
  return data;
}

export async function fetchDeliveryRequests(): Promise<{ requests: DeliveryRequest[] }> {
  const { data } = await axiosClient.get(`${BASE}/delivery/requests`);
  return data;
}

export async function askAIAssistant(query: string): Promise<AIAssistantResponse> {
  const { data } = await axiosClient.post(`${BASE}/ai/assistant`, { query });
  return data;
}
