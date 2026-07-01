export type Promotion = {
  id: string;
  title: string;
  description?: string;
  type?: 'campaign' | 'coupon' | 'flash';
  startAt?: string;
  endAt?: string;
  active?: boolean;
};
