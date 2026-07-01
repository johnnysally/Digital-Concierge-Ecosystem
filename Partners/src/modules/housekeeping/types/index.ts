export type HousekeepingTask = {
  id: string;
  roomId: string;
  assignedTo?: string;
  status: 'pending' | 'in_progress' | 'completed';
  scheduledAt?: string;
  completedAt?: string;
};
