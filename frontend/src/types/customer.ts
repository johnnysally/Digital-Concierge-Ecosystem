export type CustomerRole = "customer" | "guest";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: CustomerRole;
  loyaltyPoints: number;
  currency: string;
}

export interface Booking {
  id: string;
  propertyName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  total: number;
  nights: number;
  thumbnail: string;
}

export interface Message {
  id: string;
  sender: "customer" | "concierge" | "provider";
  body: string;
  timestamp: string;
}

export interface WalletTransaction {
  id: string;
  date: string;
  amount: number;
  status: "completed" | "pending" | "refunded";
  description: string;
}

export interface Review {
  id: string;
  title: string;
  rating: number;
  comment: string;
  createdAt: string;
  source: string;
}
