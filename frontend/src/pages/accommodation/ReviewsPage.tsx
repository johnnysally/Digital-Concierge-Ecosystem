import { useEffect, useState } from 'react';
import { getReservations } from '../../api/accommodation/reservationApi';

const ReviewsPage = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadReviews = async () => {
            try {
                const response = await getReservations({ limit: 30 });
                const mapped = (response.reservations || []).map((reservation: any) => ({
                    _id: reservation._id,
                    guest: reservation.guestName || 'Guest',
                    status: reservation.status || 'Pending',
                    note: reservation.notes || 'No guest notes recorded yet.',
                    checkIn: reservation.checkIn ? new Date(reservation.checkIn).toLocaleDateString() : 'TBD',
                }));
                setReviews(mapped);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load reviews');
            } finally {
                setLoading(false);
            }
        };

        loadReviews();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Reviews</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Guest feedback</h2>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Loading guest feedback...</p>
                ) : reviews.length === 0 ? (
                    <p className="text-sm text-slate-400">No feedback entries yet.</p>
                ) : (
                    <div className="space-y-3">
                        {reviews.map((review) => (
                            <div key={review._id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="font-medium text-white">{review.guest}</p>
                                        <p className="text-sm text-slate-400">{review.note}</p>
                                    </div>
                                    <div className="text-right text-sm">
                                        <div className="text-emerald-300">{review.status}</div>
                                        <div className="text-slate-400">{review.checkIn}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsPage;
