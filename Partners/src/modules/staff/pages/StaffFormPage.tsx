import React from 'react';
import { useForm } from 'react-hook-form';

type StaffFormValues = {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
};

export default function StaffFormPage() {
  const { register, handleSubmit } = useForm<StaffFormValues>({ defaultValues: { firstName: '', lastName: '', role: '', email: '' } });
  const onSubmit = (data: StaffFormValues) => {
    console.log('save staff', data);
    alert('Staff profile saved (mock)');
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase text-slate-500">Team member</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Add team member</h1>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">First name</label>
            <input {...register('firstName')} className="mt-2 block w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Last name</label>
            <input {...register('lastName')} className="mt-2 block w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Role</label>
          <input {...register('role')} className="mt-2 block w-full rounded-2xl border border-slate-200 px-4 py-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input {...register('email')} className="mt-2 block w-full rounded-2xl border border-slate-200 px-4 py-3" />
        </div>
        <button type="submit" className="rounded-2xl bg-slate-900 px-6 py-3 text-white font-semibold hover:bg-slate-800">
          Save member
        </button>
      </form>
    </div>
  );
}
