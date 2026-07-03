import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Rider APIs
export async function fetchRiderProfile(riderId: string) {
  const response = await apiClient.get(`/partners/accommodation/profile`);
  return response.data;
}

export async function updateRiderProfile(riderId: string, data: any) {
  const response = await apiClient.put(`/partners/accommodation/profile`, data);
  return response.data;
}

export async function fetchDocuments() {
  const response = await apiClient.get(`/partners/accommodation/documents`);
  return response.data;
}

export async function uploadDocument(formData: FormData) {
  const response = await apiClient.post(`/partners/accommodation/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

// Delivery APIs
export async function fetchDeliveries(riderId: string) {
  const response = await apiClient.get(`/transport/deliveries?riderId=${riderId}`);
  return response.data;
}

export async function acceptDelivery(deliveryId: string) {
  const response = await apiClient.post(`/transport/deliveries/${deliveryId}/accept`);
  return response.data;
}

export async function updateDeliveryStatus(deliveryId: string, status: string) {
  const response = await apiClient.put(`/transport/deliveries/${deliveryId}/status`, { status });
  return response.data;
}

// Earning APIs
export async function fetchEarnings(riderId: string) {
  const response = await apiClient.get(`/transport/earnings?riderId=${riderId}`);
  return response.data;
}

// Rating APIs
export async function fetchRatings(riderId: string) {
  const response = await apiClient.get(`/transport/ratings?riderId=${riderId}`);
  return response.data;
}

// Analytics APIs
export async function fetchAnalytics(riderId: string) {
  const response = await apiClient.get(`/transport/analytics?riderId=${riderId}`);
  return response.data;
}

export default apiClient;
