export type RoomType = {
  id: string;
  name: string;
  code?: string;
  capacity: number;
  maxOccupancy?: number;
  amenities?: string[];
  defaultPrice?: number;
  status?: 'active' | 'inactive' | 'maintenance';
};

export type Room = {
  id: string;
  roomNumber: string;
  typeId: string;
  status: 'available' | 'occupied' | 'maintenance';
  features?: string[];
  price?: number;
};
