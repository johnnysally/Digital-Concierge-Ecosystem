import React from 'react';
import { useForm } from 'react-hook-form';
import { useSavePropertyMutation } from '../../../hooks/useProperties';
import { Property } from '../types';

export default function PropertyEditPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Property>>();
  const saveMutation = useSavePropertyMutation();

  const onSubmit = (data: Partial<Property>) => {
    saveMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-900">Create Property</h1>
        <p className="mt-2 text-slate-600">Register a new accommodation to the platform.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-8 shadow-sm space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Property Name *</label>
          <input
            {...register('name', { required: 'Property name is required' })}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-slate-900 focus:outline-none"
            placeholder="Seaside Retreat Hotel"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Street Address *</label>
            <input
              {...register('address.street', { required: 'Street address is required' })}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-slate-900 focus:outline-none"
              placeholder="123 Beach Avenue"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">City *</label>
            <input
              {...register('address.city', { required: 'City is required' })}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-slate-900 focus:outline-none"
              placeholder="Miami"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Region</label>
            <input
              {...register('address.region')}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-slate-900 focus:outline-none"
              placeholder="Florida"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Postal Code</label>
            <input
              {...register('address.postalCode')}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-slate-900 focus:outline-none"
              placeholder="33139"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Description *</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={6}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-slate-900 focus:outline-none"
            placeholder="Describe your property..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="rounded-full bg-slate-900 px-8 py-3 text-white font-semibold hover:bg-slate-700 disabled:opacity-50"
          >
            {saveMutation.isPending ? 'Saving...' : 'Save Property'}
          </button>
          <button
            type="button"
            className="rounded-full border border-slate-200 px-8 py-3 font-semibold hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>

        {saveMutation.isSuccess && <p className="text-green-600 text-sm">Property saved successfully!</p>}
        {saveMutation.isError && <p className="text-red-600 text-sm">Error saving property. Please try again.</p>}
      </form>
    </div>
  );
}
