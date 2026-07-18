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
                const mapped = (response.reservations || [])
                    .filter((reservation: any) => reservation.notes || reservation.guestName)
                    .map((reservation: any) => ({
                        _id: reservation._id,
                        guest: reservation.guestName || 'Guest',
                        status: reservation.status || 'Pending',
                        note: reservation.notes || 'No guest notes recorded yet.',
                        checkIn: reservation.checkIn ? new Date(reservation.checkIn).toLocaleDateString() : 'TBD',
                        rating: reservation.rating || 4,
                        propertyName: reservation.propertyName || 'Property',
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

    const averageRating = reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : '0.0';
    const highValue = reviews.filter((review) => review.rating >= 4).length;

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Reviews</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Guest feedback</h2>
                <p className="mt-2 text-sm text-slate-400">Review recent guest sentiment and stay informed about the experience your property is delivering.</p>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Signals</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{reviews.length}</p>
                    <p className="mt-2 text-sm text-slate-400">Guest feedback entries surfaced from current reservations.</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Average rating</p>
                    <p className="mt-3 text-3xl font-semibold text-emerald-300">{averageRating} / 5</p>
                    <p className="mt-2 text-sm text-slate-400">A quick measure of guest satisfaction from recent stays.</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Positive signals</p>
                    <p className="mt-3 text-3xl font-semibold text-sky-300">{highValue}</p>
                    <p className="mt-2 text-sm text-slate-400">Bookings with strong feedback strength above 4 stars.</p>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Loading guest feedback...</p>
                ) : reviews.length === 0 ? (
                    <p className="text-sm text-slate-400">No feedback entries yet.</p>
                ) : (
                    <div className="space-y-3">
                        {reviews.map((review) => (
                            <div key={review._id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <p className="font-medium text-white">{review.guest}</p>
                                        <p className="mt-1 text-sm text-slate-400">{review.propertyName}</p>
                                        <p className="mt-2 text-sm text-slate-400">{review.note}</p>
                                    </div>
                                    <div className="text-left text-sm sm:text-right">
                                        <div className="text-amber-300">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                                        <div className="mt-1 text-emerald-300">{review.status}</div>
                                        <div className="mt-1 text-slate-400">{review.checkIn}</div>
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
