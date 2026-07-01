export type Payout = {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  scheduledAt?: string;
};

export type Transaction = {
  id: string;
  amount: number;
  type: 'payment' | 'refund' | 'commission';
  createdAt: string;
};
