import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import useReviews from '../../hooks/customer/useReviews';
import { updateReview, deleteReview, createReview } from '../../api/customer/reviewApi';
import { useTheme } from '../../context/customer/ThemeContext';

const ReviewsPage = () => {
    const [searchParams] = useSearchParams();
    const [refreshKey, setRefreshKey] = useState(0);
    const { reviews, loading, error } = useReviews(refreshKey);
    const { isDark } = useTheme();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ rating: 5, comment: '' });
    const [pendingAction, setPendingAction] = useState(false);

    const bookingId = searchParams.get('bookingId');
    const orderId = searchParams.get('orderId');
    const rideId = searchParams.get('rideId');
    const propertyId = searchParams.get('propertyId');
    const restaurantId = searchParams.get('restaurantId');
    const vehicleId = searchParams.get('vehicleId');
    const itemName = searchParams.get('name') || '';
    const [showNewReview, setShowNewReview] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        if (bookingId || orderId || rideId) {
            setShowNewReview(true);
        }
    }, [bookingId, orderId, rideId]);

   const handleCreateReview = async () => {
    setPendingAction(true);
    try {
        await createReview({
            bookingId: bookingId || undefined,
            propertyId: propertyId || restaurantId || vehicleId || undefined,
            rating: newReview.rating,
            comment: newReview.comment,
            reviewType: bookingId ? 'property' : orderId ? 'restaurant' : rideId ? 'transport' : 'property',
            itemName: itemName,
        });
        setShowNewReview(false);
        setNewReview({ rating: 5, comment: '' });
        setRefreshKey((v) => v + 1);
    } finally {
        setPendingAction(false);
    }
};

    const handleEdit = (review: any) => {
        setEditingId(review._id);
        setEditForm({ rating: review.rating, comment: review.comment || '' });
    };

    const handleUpdate = async (id: string) => {
        setPendingAction(true);
        try {
            await updateReview(id, editForm);
            setEditingId(null);
            setRefreshKey((v) => v + 1);
        } finally {
            setPendingAction(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this review?')) return;
        setPendingAction(true);
        try {
            await deleteReview(id);
            setRefreshKey((v) => v + 1);
        } finally {
            setPendingAction(false);
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    return (
        <div className="space-y-8">
            <SectionHeader title="Reviews" subtitle="Manage your review history and keep your feedback up to date." />

            {showNewReview && (
                <div className={`rounded-3xl border-2 border-amber-500/30 p-6 ${isDark ? 'bg-slate-900/95' : 'bg-white'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            ⭐ Review {itemName || 'your experience'}
                        </h3>
                        <button onClick={() => setShowNewReview(false)}
                            className={`text-xs ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'}`}>Cancel</button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className={`block text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Rating</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={star} onClick={() => setNewReview({ ...newReview, rating: star })}
                                        className={`text-2xl transition-colors ${star <= newReview.rating ? 'text-amber-400' : 'text-slate-600'}`}>
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className={`block text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Your feedback</label>
                            <textarea value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                placeholder="Share your experience..."
                                rows={3}
                                className={`w-full rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-slate-700 bg-slate-950 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'}`} />
                        </div>
                        <button onClick={handleCreateReview} disabled={pendingAction}
                            className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-400 disabled:opacity-50">
                            {pendingAction ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </div>
            )}

            <div className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-slate-800 bg-slate-900/95' : 'border-slate-200 bg-white'}`}>
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>Your feedback</p>
                        <h3 className={`mt-2 text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{reviews.length} submitted review{reviews.length === 1 ? '' : 's'}</h3>
                    </div>
                    <div className={`rounded-2xl border px-4 py-3 ${isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-slate-50'}`}>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Average rating</p>
                        <p className={`mt-1 text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{averageRating} / 5</p>
                    </div>
                </div>
            </div>

            {error && <div className={`rounded-2xl border p-4 text-sm ${isDark ? 'border-rose-500/30 bg-rose-500/10 text-rose-300' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>{error}</div>}

            <div className="space-y-4">
                {loading ? (
                    <div className={`rounded-3xl border p-6 text-sm ${isDark ? 'border-slate-800 bg-slate-900/95 text-slate-400' : 'border-slate-200 bg-white text-slate-600'}`}>Loading reviews...</div>
                ) : reviews.length === 0 && !showNewReview ? (
                    <div className={`rounded-3xl border border-dashed p-8 text-center text-sm ${isDark ? 'border-slate-800 bg-slate-900/95 text-slate-400' : 'border-slate-200 bg-white text-slate-600'}`}>
                        You have not submitted any reviews yet.
                    </div>
                ) : reviews.map((review: any) => (
                    <div key={review._id} className={`rounded-3xl border p-5 shadow-sm ${isDark ? 'border-slate-800 bg-slate-900/95' : 'border-slate-200 bg-white'}`}>
                        {editingId === review._id ? (
                            <div className="space-y-3">
                                <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Rating</label>
                                <select value={editForm.rating} onChange={(e) => setEditForm({ ...editForm, rating: +e.target.value })}
                                    className={`rounded-xl border px-3 py-2 text-sm ${isDark ? 'border-slate-700 bg-slate-950 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'}`}>
                                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} stars</option>)}
                                </select>
                                <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Feedback</label>
                                <textarea value={editForm.comment} onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                                    className={`w-full rounded-xl border px-4 py-2 text-sm ${isDark ? 'border-slate-700 bg-slate-950 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'}`} rows={3} />
                                <div className="flex gap-2">
                                    <button onClick={() => handleUpdate(review._id)} disabled={pendingAction}
                                        className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-60">Save</button>
                                    <button onClick={() => setEditingId(null)}
                                        className={`rounded-xl px-4 py-2 text-xs font-semibold ${isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{review.property?.name || 'Property'}</h3>
                                        <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{review.comment || 'No feedback provided.'}</p>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <div className="text-sm font-semibold text-amber-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                                        <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button onClick={() => handleEdit(review)}
                                        className={`text-xs font-semibold ${isDark ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-500'}`}>Edit</button>
                                    <button onClick={() => handleDelete(review._id)}
                                        className={`text-xs font-semibold ${isDark ? 'text-rose-400 hover:text-rose-300' : 'text-rose-600 hover:text-rose-500'}`}>Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewsPage;