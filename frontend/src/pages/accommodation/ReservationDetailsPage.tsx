import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteReservation, getReservation, updateReservationStatus } from '../../api/accommodation/reservationApi';

const ReservationDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!id) return;
        getReservation(id)
            .then((response) => {
                setReservation(response.reservation);
                setStatus(response.reservation?.status || 'pending');
            })
            .catch((err: any) => setError(err?.response?.data?.message || 'Unable to load reservation'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleStatusUpdate = async () => {
        if (!id) return;
        setSaving(true);
        setError('');
        setMessage('');
        try {
            const response = await updateReservationStatus(id, status);
            setReservation(response.reservation);
            setMessage(response.message || 'Status updated successfully.');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to update status');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = async () => {
        if (!id) return;
        if (!confirm('Delete this reservation? This will free up the room.')) return;
        setSaving(true);
        setError('');
        try {
            await deleteReservation(id);
            navigate('/accommodation/reservations');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to delete reservation');
        } finally {
            setSaving(false);
        }
    };

    const getStatusColor = (s: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-amber-500/15 text-amber-300', confirmed: 'bg-emerald-500/15 text-emerald-300',
            checked_in: 'bg-sky-500/15 text-sky-300', checked_out: 'bg-violet-500/15 text-violet-300',
            cancelled: 'bg-rose-500/15 text-rose-300', no_show: 'bg-slate-500/15 text-slate-400',
        };
        return colors[s] || 'bg-slate-500/15 text-slate-400';
    };

    const getPaymentColor = (s: string) => {
        const colors: Record<string, string> = {
            paid: 'bg-emerald-500/15 text-emerald-300', pending: 'bg-amber-500/15 text-amber-300',
            refunded: 'bg-rose-500/15 text-rose-300', partial: 'bg-sky-500/15 text-sky-300',
        };
        return colors[s] || 'bg-slate-500/15 text-slate-400';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Reservation</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">
                        {reservation ? `Booking #${reservation._id?.slice(-6)}` : 'Reservation details'}
                    </h2>
                </div>
                <button onClick={() => navigate('/accommodation/reservations')}
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 transition hover:border-emerald-500 hover:text-white">
                    ← Back to reservations
                </button>
            </div>

            {error && <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>}
            {message && <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">{message}</div>}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Loading reservation details...</p>
                ) : reservation ? (
                    <div className="space-y-6 text-sm text-slate-300">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-slate-400">Guest</p>
                                <p className="mt-1 font-medium text-white text-lg">{reservation.guestName || reservation.customer?.firstName || 'Guest'} {reservation.customer?.lastName || ''}</p>
                                <p className="text-slate-400 mt-1">{reservation.customer?.email || ''}</p>
                                {reservation.customer?.phone && <p className="text-slate-400">{reservation.customer.phone}</p>}
                            </div>
                            <div>
                                <p className="text-slate-400">Property</p>
                                <p className="mt-1 font-medium text-white">{reservation.property?.name || 'Property'}</p>
                                <p className="text-slate-400 mt-1">Room {reservation.room?.roomNumber || 'N/A'} · {reservation.room?.type || ''}</p>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-4">
                            <div>
                                <p className="text-slate-400">Check-in</p>
                                <p className="mt-1 font-medium text-white">{reservation.checkIn ? new Date(reservation.checkIn).toLocaleDateString() : '—'}</p>
                            </div>
                            <div>
                                <p className="text-slate-400">Check-out</p>
                                <p className="mt-1 font-medium text-white">{reservation.checkOut ? new Date(reservation.checkOut).toLocaleDateString() : '—'}</p>
                            </div>
                            <div>
                                <p className="text-slate-400">Amount</p>
                                <p className="mt-1 font-medium text-white">KES {reservation.totalAmount?.toLocaleString() || '0'}</p>
                            </div>
                            <div>
                                <p className="text-slate-400">Guests</p>
                                <p className="mt-1 font-medium text-white">{reservation.guests || 1}</p>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <p className="text-slate-400">Status</p>
                                <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusColor(reservation.status || 'pending')}`}>
                                    {(reservation.status || 'pending').replace('_', ' ')}
                                </span>
                            </div>
                            <div>
                                <p className="text-slate-400">Payment</p>
                                <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentColor(reservation.paymentStatus || 'pending')}`}>
                                    {reservation.paymentStatus || 'Pending'}
                                </span>
                            </div>
                            <div>
                                <p className="text-slate-400">Source</p>
                                <span className="mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold bg-slate-800 text-slate-300 capitalize">
                                    {reservation.source === 'booking' ? 'Online Booking' : reservation.source === 'direct' ? 'Direct Reservation' : 'N/A'}
                                </span>
                            </div>
                        </div>

                        {reservation.specialRequests && (
                            <div>
                                <p className="text-slate-400">Special Requests</p>
                                <p className="mt-1 text-white">{reservation.specialRequests}</p>
                            </div>
                        )}

                        <div className="border-t border-slate-800 pt-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm text-slate-300">Update Status</label>
                                    <select value={status} onChange={(e) => setStatus(e.target.value)}
                                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="checked_in">Checked In</option>
                                        <option value="checked_out">Checked Out</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="no_show">No Show</option>
                                    </select>
                                    <p className="mt-1 text-xs text-slate-500">Payment & room status will auto-update</p>
                                </div>
                                <div className="flex flex-col gap-3 sm:justify-end">
                                    <button onClick={handleStatusUpdate} disabled={saving}
                                        className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60">
                                        {saving ? 'Updating...' : 'Update Status'}
                                    </button>
                                    <button onClick={handleCancel} disabled={saving}
                                        className="rounded-2xl border border-rose-500 px-5 py-3 text-sm text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-60">
                                        Delete Reservation
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-slate-400">Reservation not found.</p>
                )}
            </div>
        </div>
    );
};

export default ReservationDetailsPage;