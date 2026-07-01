import React from 'react';
import { useForm } from 'react-hook-form';

type RoomFormValues = {
  roomNumber: string;
  type: string;
  price: number;
  occupancy: number;
};

export default function RoomFormPage() {
  const { register, handleSubmit } = useForm<RoomFormValues>({ defaultValues: { roomNumber: '', type: '', price: 0, occupancy: 2 } });
  const onSubmit = (data: RoomFormValues) => {
    console.log('save room', data);
    alert('Room saved (mock)');
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase text-slate-500">Room setup</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Create / edit room</h1>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-700">Room number</label>
          <input {...register('roomNumber')} className="mt-2 block w-full rounded-2xl border border-slate-200 px-4 py-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Room type</label>
          <input {...register('type')} className="mt-2 block w-full rounded-2xl border border-slate-200 px-4 py-3" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Price per night</label>
            <input type="number" {...register('price', { valueAsNumber: true })} className="mt-2 block w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Max occupancy</label>
            <input type="number" {...register('occupancy', { valueAsNumber: true })} className="mt-2 block w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </div>
        </div>
        <button type="submit" className="rounded-2xl bg-slate-900 px-6 py-3 text-white font-semibold hover:bg-slate-800">
          Save room
        </button>
      </form>
    </div>
  );
}
