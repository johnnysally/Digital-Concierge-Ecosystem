import { useEffect, useState } from 'react';
import { getRestaurantReviews } from './mockData';

const ReviewsPage = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setReviews(getRestaurantReviews());
        setLoading(false);
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Reviews</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Customer feedback</h1>
            </div>

            <div className="grid gap-4">
                {loading ? <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-400">Loading reviews...</div> : reviews.length ? reviews.map((review) => (
                    <div key={review._id} className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-lg font-semibold text-white">{review.customer?.firstName || 'Customer'} {review.customer?.lastName || ''}</p>
                                <p className="mt-2 text-sm text-slate-400">{review.comment || 'No comment.'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-amber-300">{review.rating || '—'} / 5</p>
                                <p className="mt-1 text-sm text-slate-400">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : '—'}</p>
                            </div>
                        </div>
                    </div>
                )) : <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-400">No reviews yet.</div>}
            </div>
        </div>
    );
};

export default ReviewsPage;
