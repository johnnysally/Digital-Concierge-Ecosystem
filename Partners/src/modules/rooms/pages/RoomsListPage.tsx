import React from 'react';
import { useQuery } from '@tanstack/react-query';
import * as roomsService from '../services/roomsService';
import { Link } from 'react-router-dom';

export default function RoomsListPage() {
  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: roomsService.fetchRooms,
  });

  if (isLoading) return <div>Loading rooms...</div>;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase text-slate-500">Room Management</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Rooms & Inventory</h1>
        </div>
        <Link to="/partners/accommodation/rooms/new" className="rounded-full bg-slate-900 px-6 py-3 text-white font-semibold">
          Add Room
        </Link>
      </header>

      <div className="grid gap-4">
        {rooms?.map((room) => (
          <div key={room.id} className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{room.roomNumber}</h3>
                <p className="mt-1 text-sm text-slate-600">Type: {room.typeId}</p>
                <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  room.status === 'available' ? 'bg-green-100 text-green-700' :
                  room.status === 'occupied' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {room.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold">${room.price}</p>
                <p className="text-sm text-slate-600">/night</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
