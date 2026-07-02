import { useQuery } from '@tanstack/react-query';
import { fetchReviews } from '../../reviews/services/reviewsService';

export default function ReviewsPage() {
  const { data } = useQuery({ queryKey: ['restaurant-reviews'], queryFn: fetchReviews });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Reviews</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Monitor customer feedback and respond to reviews.</p>
      </div>
      <div className="space-y-4">
        {data?.reviews.map((review) => (
          <div key={review.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{review.customer}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Rating: {review.rating} / 5</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">{review.status}</span>
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
