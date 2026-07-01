import React from 'react';
import { useQuery } from '@tanstack/react-query';
import * as housekeepingService from '../services/housekeepingService';

export default function HousekeepingListPage() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['housekeeping-tasks'],
    queryFn: housekeepingService.fetchTasks,
  });

  if (isLoading) return <div>Loading tasks...</div>;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase text-slate-500">Operations</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Cleaning & Maintenance</h1>
        </div>
        <button className="rounded-full bg-slate-900 px-6 py-3 text-white font-semibold">New Task</button>
      </header>

      <div className="grid gap-4">
        {tasks?.map((task) => (
          <div key={task.id} className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Room {task.roomId}</h3>
                <p className="mt-1 text-sm text-slate-600">Assigned to: {task.assignedTo || 'Unassigned'}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                task.status === 'completed' ? 'bg-green-100 text-green-700' :
                task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
