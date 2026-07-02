export interface Metric {
  label: string;
  value: string;
  description: string;
}

export interface Order {
  id: string;
  customer: string;
  status: string;
  total: string;
  eta: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  items: MenuItem[];
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
}

export interface Review {
  id: string;
  customer: string;
  rating: number;
  comment: string;
  status: string;
}

export interface AnalyticsInsight {
  label: string;
  value: string;
}

export interface Profile {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  deliveryRadius: string;
  openingHours: string;
  paymentMethods: string[];
}

export interface Settings {
  language: string;
  currency: string;
  notifications: boolean;
  paymentMethods: string[];
  deliveryRadius: string;
  openHours: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
}

export interface PaymentOverview {
  balance: string;
  pending: string;
  totalRevenue: string;
  commissions: string;
}

export interface DeliveryRequest {
  id: string;
  orderId: string;
  deliveryType: string;
  rider?: string;
  eta: string;
  status: string;
}

export interface AIAssistantResponse {
  response: string;
}
