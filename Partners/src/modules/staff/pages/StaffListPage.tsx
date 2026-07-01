import React from 'react';
import { useQuery } from '@tanstack/react-query';
import * as staffService from '../services/staffService';

export default function StaffListPage() {
  const { data: staff, isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: staffService.fetchStaff,
  });

  if (isLoading) return <div>Loading staff...</div>;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase text-slate-500">Team Management</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Staff & Team</h1>
        </div>
        <button className="rounded-full bg-slate-900 px-6 py-3 text-white font-semibold">Add Staff</button>
      </header>

      <div className="grid gap-4">
        {staff?.map((member) => (
          <div key={member.id} className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{member.firstName} {member.lastName}</h3>
                <p className="mt-1 text-sm text-slate-600">Role: {member.role}</p>
                <p className="text-sm text-slate-600">{member.email}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  member.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {member.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
