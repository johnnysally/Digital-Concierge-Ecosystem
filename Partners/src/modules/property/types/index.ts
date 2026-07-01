export type Address = {
  street?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
};

export type RoomInfo = {
  id: string;
  name: string;
  capacity: number;
  price: number;
  status?: 'available' | 'occupied' | 'maintenance';
};

export type Property = {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  address?: Address;
  rooms?: RoomInfo[];
  amenities?: string[];
  photos?: string[];
  media?: string[];
  published?: boolean;
};
