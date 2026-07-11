import React, { useState } from 'react';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import useReviews from '../../hooks/customer/useReviews';
import { updateReview, deleteReview } from '../../api/customer/reviewApi';

const ReviewsPage = () => {
    const reviews = useReviews();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ rating: 5, comment: '' });

    const handleEdit = (review: any) => {
        setEditingId(review._id);
        setEditForm({ rating: review.rating, comment: review.comment || '' });
    };

    const handleUpdate = async (id: string) => {
        await updateReview(id, editForm);
        setEditingId(null);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this review?')) await deleteReview(id);
    };

    return (
        <div className="space-y-8">
            <SectionHeader title="Reviews" subtitle="Manage your reviews across DigitalSafaris experiences." />
            <div className="space-y-4">
                {reviews.map((review: any) => (
                    <div key={review._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-5 text-slate-300">
                        {editingId === review._id ? (
                            <div className="space-y-3">
                                <select value={editForm.rating} onChange={(e) => setEditForm({ ...editForm, rating: +e.target.value })}
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white">
                                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} stars</option>)}
                                </select>
                                <textarea value={editForm.comment} onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white" rows={3} />
                                <div className="flex gap-2">
                                    <button onClick={() => handleUpdate(review._id)} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white">Save</button>
                                    <button onClick={() => setEditingId(null)} className="rounded-xl bg-slate-700 px-4 py-2 text-xs font-semibold text-white">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">{review.property?.name || 'Property'}</h3>
                                    <span className="text-sm text-emerald-400">{'Γÿà'.repeat(review.rating)}{'Γÿå'.repeat(5-review.rating)}</span>
                                </div>
                                <p className="mt-2 text-sm">{review.comment}</p>
                                <div className="mt-3 flex gap-2">
                                    <button onClick={() => handleEdit(review)} className="text-xs text-sky-400 hover:text-sky-300">Edit</button>
                                    <button onClick={() => handleDelete(review._id)} className="text-xs text-rose-400 hover:text-rose-300">Delete</button>
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