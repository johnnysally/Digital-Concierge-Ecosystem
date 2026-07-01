export type ReservationStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';

export type Reservation = {
  id: string;
  propertyId: string;
  roomId?: string;
  guestId: string;
  checkIn: string;
  checkOut: string;
  status: ReservationStatus;
  totalAmount?: number;
  currency?: string;
};
