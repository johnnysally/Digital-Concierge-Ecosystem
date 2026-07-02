import { useQuery } from '@tanstack/react-query';
import { fetchRatings } from '../../ratings/services/ratingsService';

export default function RatingsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['transport-ratings'],
    queryFn: () => fetchRatings('rider-1'), // Replace with actual rider ID
  });

  const averageRating = data?.ratings?.length
    ? (data.ratings.reduce((sum: number, r: any) => sum + r.score, 0) / data.ratings.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Customer Ratings</h2>
            <p className="mt-2 text-sm text-slate-500">View feedback and ratings from customers.</p>
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
      </div>

      {isError ? (
        <div className="rounded-[32px] border border-red-200 bg-red-50 p-8 text-sm text-red-700">
          Unable to load ratings. Please refresh the page.
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
              <h3 className="text-sm text-slate-500">Average Rating</h3>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {averageRating} <span className="text-2xl">★</span>
              </p>
            </div>

            <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
              <h3 className="text-sm text-slate-500">Total Ratings</h3>
              <p className="mt-3 text-3xl font-bold text-slate-900">{data?.ratings?.length ?? 0}</p>
            </div>

            <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
              <h3 className="text-sm text-slate-500">5-Star Ratings</h3>
              <p className="mt-3 text-3xl font-bold text-emerald-600">
                {data?.ratings?.filter((r: any) => r.score === 5).length ?? 0}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {data?.ratings?.length ? (
              data.ratings.map((rating: any) => (
                <div
                  key={rating.id}
                  className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm ring-1 ring-slate-200/80"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-slate-900">
                          {rating.score} <span className="text-base">★</span>
                        </span>
                        <span className="text-sm text-slate-500">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {rating.comment && (
                        <p className="mt-3 text-sm text-slate-600">{rating.comment}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[32px] border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200/80">
                No ratings yet.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
