import React from 'react';
import { useForm } from 'react-hook-form';

type FormValues = {
  businessName: string;
  email: string;
  phone?: string;
};

export default function ProfilePage() {
  const { register, handleSubmit } = useForm<FormValues>({ defaultValues: { businessName: '', email: '' } });
  const onSubmit = (data: FormValues) => {
    console.log('save profile', data);
    alert('Profile saved (mock)');
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Business Profile</h1>
      <p className="text-sm text-slate-600 mt-1">Update your business information and contact details.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium">Business Name</label>
          <input {...register('businessName')} className="mt-1 block w-full rounded border p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Contact Email</label>
          <input {...register('email')} className="mt-1 block w-full rounded border p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input {...register('phone')} className="mt-1 block w-full rounded border p-2" />
        </div>
        <div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
}
