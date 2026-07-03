import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchRatings } from '../../ratings/services/ratingsService';

const distributionClasses = ['bg-emerald-500', 'bg-lime-400', 'bg-sky-400', 'bg-orange-400', 'bg-rose-500'];

export default function RatingsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['transport-ratings'],
    queryFn: () => fetchRatings('rider-1'),
  });

  const ratings = data?.ratings ?? [];
  const averageRating = ratings.length ? (ratings.reduce((sum: number, r: any) => sum + r.score, 0) / ratings.length).toFixed(1) : '0.0';
  const distribution = useMemo(
    () => [5, 4, 3, 2, 1].map((score) => ({
      score,
      count: ratings.filter((rating: any) => rating.score === score).length,
    })),
    [ratings],
  );

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Customer Ratings</h2>
            <p className="mt-2 text-sm text-slate-500">Monitor feedback and maintain your star performance.</p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </section>

      {isError ? (
        <div className="rounded-[32px] border border-red-200 bg-red-50 p-8 text-sm text-red-700">
          Unable to load ratings. Please refresh the page.
        </div>
      ) : (
        <>
          <section className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
              <p className="text-sm text-slate-500">Average Rating</p>
              <p className="mt-4 text-5xl font-semibold text-slate-900">{averageRating} ★</p>
              <p className="mt-3 text-sm text-slate-500">Based on {ratings.length} reviews.</p>
            </article>
            <article className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
              <p className="text-sm text-slate-500">5-Star reviews</p>
              <p className="mt-4 text-4xl font-semibold text-emerald-600">{distribution.find((item) => item.score === 5)?.count ?? 0}</p>
            </article>
            <article className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
              <p className="text-sm text-slate-500">Recent mentions</p>
              <p className="mt-4 text-4xl font-semibold text-slate-900">{ratings.filter((rating: any) => rating.comment).length}</p>
            </article>
          </section>

          <section className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-xl font-semibold text-slate-900">Rating distribution</h3>
            <div className="mt-6 space-y-4">
              {distribution.map((item, index) => {
                const total = ratings.length || 1;
                return (
                  <div key={item.score} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>{item.score} stars</span>
                      <span>{item.count}</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100">
                      <div className={`${distributionClasses[index]} h-3 rounded-full`} style={{ width: `${(item.count / total) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-4">
            {ratings.length ? (
              ratings.map((rating: any) => (
                <article key={rating.id} className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-slate-900">{rating.score} ★</span>
                        <span className="text-sm text-slate-500">{new Date(rating.createdAt).toLocaleDateString()}</span>
                      </div>
                      {rating.comment && <p className="mt-4 text-sm text-slate-600">{rating.comment}</p>}
                    </div>
                    <button className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                      Reply
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[32px] border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200/80">
                No ratings yet.
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
