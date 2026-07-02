import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPromotions, createPromotion } from '../../promotions/services/promotionsService';
import type { Promotion } from '../../../shared/types/restaurant';

const initialDiscount = 10;

export default function PromotionsPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState(initialDiscount);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['restaurant-promotions'],
    queryFn: fetchPromotions,
  });

  const createMutation = useMutation({
    mutationFn: () => createPromotion({ title, description, discount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-promotions'] });
      setTitle('');
      setDescription('');
      setDiscount(initialDiscount);
    },
  });

  const handleSubmit = async () => {
    try {
      await createMutation.mutateAsync();
    } catch (error) {
      console.error('Failed to create promotion', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Promotions</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Create and manage meal discounts, combos, and specials.</p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing…' : 'Refresh list'}
          </button>
        </div>
      </div>

      {isError ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          Unable to load promotions. Please refresh the page.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data?.promotions?.length ? (
            data.promotions.map((promo: Promotion) => (
              <div key={promo.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{promo.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{promo.description}</p>
                <div className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-50">Discount: {promo.discount}%</div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              No promotions available.
            </div>
          )}
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">New Promotion</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Add a new promotion and broadcast it to your guest ordering experience.</p>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={createMutation.isLoading || !title || !description}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {createMutation.isLoading ? 'Saving…' : 'Add promotion'}
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Promotion title"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Short description"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Discount (%)</label>
            <input
              type="number"
              min={1}
              max={100}
              value={discount}
              onChange={(event) => setDiscount(Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
        </div>

        {createMutation.isError && (
          <div className="mt-4 text-sm text-red-500">Unable to save promotion. Please try again.</div>
        )}
        {createMutation.isSuccess && (
          <div className="mt-4 text-sm text-emerald-600">Promotion added successfully.</div>
        )}
      </div>
    </div>
  );
}
