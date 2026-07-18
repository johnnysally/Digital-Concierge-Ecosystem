import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteReservation, getReservation, updateReservationStatus } from '../../api/accommodation/reservationApi';

const ReservationDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchReservation = async () => {
            try {
                const response = await getReservation(id);
                setReservation(response.reservation);
                setStatus(response.reservation?.status || 'pending');
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load reservation');
            } finally {
                setLoading(false);
            }
        };

        fetchReservation();
    }, [id]);

    const handleStatusUpdate = async () => {
        if (!id) return;
        setSaving(true);
        setError('');

        try {
            const response = await updateReservationStatus(id, status);
            setReservation(response.reservation);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to update status');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = async () => {
        if (!id) return;
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Reservation</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">{reservation ? `Booking #${reservation._id.slice(-6)}` : 'Reservation details'}</h2>
                </div>
                <button
                    onClick={() => navigate('/accommodation/reservations')}
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 transition hover:border-emerald-500 hover:text-white"
                >
                    Back to reservations
                </button>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Loading reservation details...</p>
                ) : reservation ? (
                    <div className="space-y-6 text-sm text-slate-300">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-slate-400">Guest</p>
                                <p className="mt-1 font-medium text-white">{reservation.guestName || 'Guest'}</p>
                                <p className="text-slate-400 mt-1">{reservation.customer?.email || ''}</p>
                            </div>
                            <div>
                                <p className="text-slate-400">Property</p>
                                <p className="mt-1 font-medium text-white">{reservation.property?.name || 'Property'}</p>
                                <p className="text-slate-400 mt-1">Room {reservation.room?.roomNumber || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <p className="text-slate-400">Check-in</p>
                                <p className="mt-1 font-medium text-white">{reservation.checkIn || '—'}</p>
                            </div>
                            <div>
                                <p className="text-slate-400">Check-out</p>
                                <p className="mt-1 font-medium text-white">{reservation.checkOut || '—'}</p>
                            </div>
                            <div>
                                <p className="text-slate-400">Amount</p>
                                <p className="mt-1 font-medium text-white">{reservation.totalAmount ? `KES ${reservation.totalAmount}` : 'N/A'}</p>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="checked_in">Checked in</option>
                                    <option value="checked_out">Checked out</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="no_show">No show</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-3 sm:items-end">
                                <button
                                    type="button"
                                    onClick={handleStatusUpdate}
                                    disabled={saving}
                                    className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
                                >
                                    Update status
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={saving}
                                    className="rounded-2xl border border-rose-500 px-5 py-3 text-sm text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-60"
                                >
                                    Cancel booking
                                </button>
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
