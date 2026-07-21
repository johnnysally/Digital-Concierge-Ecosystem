import { useEffect, useState } from 'react';
import { getReviews } from '../../api/transport/reviewApi';
import { getRides } from '../../api/transport/rideApi';

const ReviewsPage = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getReviews();
                setReviews(Array.isArray(data) ? data : data.reviews ?? []);
            } catch (err) {
                // reviews endpoint may not exist; fallback to rides with rating/feedback
                try {
                    const ridesRes = await getRides({ limit: 200 });
                    const ridesArray = Array.isArray(ridesRes) ? ridesRes : ridesRes.rides ?? [];
                    const derived = ridesArray.filter((r: any) => r.rating || r.feedback).map((r: any) => ({ rideId: r._id || r.id, rating: r.rating, feedback: r.feedback, createdAt: r.createdAt }));
                    setReviews(derived);
                } catch {
                    setReviews([]);
                }
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/10">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Reviews</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Transport reviews</h2>
                <p className="mt-2 text-sm text-slate-400">Customer feedback and ratings from recent rides.</p>
            </div>

            {loading ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-slate-400">Loading reviews...</div>
            ) : reviews.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-slate-400">No reviews available.</div>
            ) : (
                <div className="grid gap-4">
                    {reviews.map((r, idx) => (
                        <div key={r._id || r.id || idx} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm text-slate-400">Ride</p>
                                    <p className="mt-1 text-sm font-semibold text-white">{r.rideId || r.ride || '—'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-400">Rating</p>
                                    <p className="mt-1 text-lg font-semibold text-white">{r.rating ?? '—'}</p>
                                </div>
                            </div>
                            <div className="mt-3 text-sm text-slate-300">{r.feedback || r.comment || 'No comment provided.'}</div>
                            <div className="mt-3 text-xs text-slate-500">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewsPage;
