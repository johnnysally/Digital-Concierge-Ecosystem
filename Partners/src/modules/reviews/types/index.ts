export type Review = {
  id: string;
  reservationId?: string;
  guestId?: string;
  rating: number;
  title?: string;
  body?: string;
  createdAt?: string;
};
