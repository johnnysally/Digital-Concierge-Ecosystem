export interface Rider {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  vehicleType: string;
  vehicleLicensePlate: string;
  rating: number;
  totalDeliveries: number;
  verified: boolean;
  onlineStatus: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

export interface Delivery {
  id: string;
  riderId: string;
  restaurantId: string;
  customerId: string;
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  pickupLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  deliveryLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  orderDetails: {
    id: string;
    items: string[];
    totalPrice: number;
  };
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  earning: number;
  createdAt: string;
  updatedAt: string;
}

export interface Earning {
  id: string;
  riderId: string;
  deliveryId: string;
  amount: number;
  status: 'pending' | 'paid' | 'settled';
  currency: string;
  createdAt: string;
  settledAt?: string;
}

export interface Rating {
  id: string;
  riderId: string;
  deliveryId: string;
  customerId: string;
  score: number;
  comment?: string;
  createdAt: string;
}

export interface Analytics {
  totalDeliveries: number;
  totalEarnings: number;
  averageRating: number;
  activeDeliveries: number;
  completionRate: number;
  peakHours: string[];
  weeklyRevenue: number;
  monthlyRevenue: number;
}
