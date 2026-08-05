import { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import { getStoredRestaurantTheme } from '../../components/restaurant/layout/theme';

const ReviewsPage = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const isLight = getStoredRestaurantTheme() === 'light';

    useEffect(() => {
        api.get('/restaurant/reviews')
            .then((res) => setReviews(res.data.reviews || []))
            .catch((err) => setError(err?.response?.data?.message || 'Unable to load reviews'))
            .finally(() => setLoading(false));
    }, []);

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Reviews</p>
                <h1 className={`mt-3 text-3xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Customer feedback</h1>
                <p className={`mt-2 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>See what customers are saying about your restaurant.</p>
            </div>

            {error && <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>}

            <div className="grid gap-4 sm:grid-cols-2">
                <div className={`rounded-2xl border p-6 ${isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/80'}`}>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Average rating</p>
                    <p className={`mt-2 text-3xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{averageRating} / 5</p>
                </div>
                <div className={`rounded-2xl border p-6 ${isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/80'}`}>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Review count</p>
                    <p className={`mt-2 text-3xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{reviews.length}</p>
                </div>
            </div>

            <div className={`rounded-2xl border p-6 ${isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/80'}`}>
                {loading ? (
                    <p className="text-sm text-slate-400">Loading reviews...</p>
                ) : reviews.length === 0 ? (
                    <p className="text-sm text-slate-400">No reviews yet. Customer feedback will appear here.</p>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review._id} className={`rounded-xl border p-4 ${isLight ? 'border-slate-100 bg-slate-50' : 'border-slate-800 bg-slate-950/70'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                            {review.customer?.firstName || 'Customer'} {review.customer?.lastName || ''}
                                        </p>
                                        <div className="text-amber-500 text-sm mt-1">
                                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                        </div>
                                    </div>
                                    <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {review.comment && (
                                    <p className={`mt-3 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{review.comment}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsPage;