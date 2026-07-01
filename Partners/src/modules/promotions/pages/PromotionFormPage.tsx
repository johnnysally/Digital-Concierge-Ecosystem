import React from 'react';
import { useForm } from 'react-hook-form';

type PromotionFormValues = {
  title: string;
  description: string;
  discount: number;
  validUntil: string;
};

export default function PromotionFormPage() {
  const { register, handleSubmit } = useForm<PromotionFormValues>({ defaultValues: { title: '', description: '', discount: 0, validUntil: '' } });
  const onSubmit = (data: PromotionFormValues) => {
    console.log('save promotion', data);
    alert('Promotion saved (mock)');
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase text-slate-500">Promotions</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">New promotion</h1>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-700">Title</label>
          <input {...register('title')} className="mt-2 block w-full rounded-2xl border border-slate-200 px-4 py-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea {...register('description')} className="mt-2 block w-full rounded-2xl border border-slate-200 px-4 py-3" rows={4} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Discount (%)</label>
            <input type="number" {...register('discount', { valueAsNumber: true })} className="mt-2 block w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Valid until</label>
            <input type="date" {...register('validUntil')} className="mt-2 block w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </div>
        </div>
        <button type="submit" className="rounded-2xl bg-slate-900 px-6 py-3 text-white font-semibold hover:bg-slate-800">
          Save promotion
        </button>
      </form>
    </div>
  );
}
