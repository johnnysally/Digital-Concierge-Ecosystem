import { useEffect, useState } from 'react';
import { api } from '../../api/axios';

const ReviewsPage = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/transport/reviews')
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
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Reviews</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Customer feedback</h1>
                <p className="mt-2 text-sm text-slate-400">See what riders are saying about your transport service.</p>
            </div>

            {error && <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>}

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Average rating</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{averageRating} / 5</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Review count</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{reviews.length}</p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Loading reviews...</p>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-4">⭐</div>
                        <p className="text-slate-400">No reviews yet.</p>
                        <p className="text-sm text-slate-500 mt-1">Customer feedback will appear here after completed rides.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review._id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-white">
                                            {review.customer?.firstName || 'Customer'} {review.customer?.lastName || ''}
                                        </p>
                                        <div className="text-amber-500 text-sm mt-1">
                                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {review.comment && (
                                    <p className="mt-3 text-sm text-slate-400">{review.comment}</p>
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