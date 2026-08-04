import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getReservations } from '../../api/accommodation/reservationApi';

interface ReservationItem {
    _id: string;
    guestName?: string;
    status?: string;
    paymentStatus?: string;
    totalAmount?: number;
    checkIn?: string;
    checkOut?: string;
    source?: string;
    property?: any;
    room?: any;
}

const ReservationsListPage = () => {
    const [reservations, setReservations] = useState<ReservationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const params: any = { limit: 50 };
                if (statusFilter) params.status = statusFilter;
                const response = await getReservations(params);
                setReservations(response.reservations || []);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load reservations');
            } finally {
                setLoading(false);
            }
        };
        fetchReservations();
    }, [statusFilter]);

    const statuses = ['', 'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'];

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-amber-500/15 text-amber-300',
            confirmed: 'bg-emerald-500/15 text-emerald-300',
            checked_in: 'bg-sky-500/15 text-sky-300',
            checked_out: 'bg-violet-500/15 text-violet-300',
            cancelled: 'bg-rose-500/15 text-rose-300',
            no_show: 'bg-slate-500/15 text-slate-400',
        };
        return colors[status] || 'bg-slate-500/15 text-slate-400';
    };

    const getPaymentColor = (status: string) => {
        const colors: Record<string, string> = {
            paid: 'bg-emerald-500/15 text-emerald-300',
            pending: 'bg-amber-500/15 text-amber-300',
            refunded: 'bg-rose-500/15 text-rose-300',
            partial: 'bg-sky-500/15 text-sky-300',
        };
        return colors[status] || 'bg-slate-500/15 text-slate-400';
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Reservations</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Track guest bookings and stay outcomes</h2>
                <p className="mt-1 text-sm text-slate-400">{reservations.length} total reservations</p>
            </div>

            <div className="flex gap-2 flex-wrap">
                {statuses.map((s) => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                        className={`rounded-xl px-4 py-2 text-xs font-semibold capitalize transition-colors ${statusFilter === s ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                        {s || 'All'}
                    </button>
                ))}
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Loading reservations...</p>
                ) : reservations.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-4">📅</div>
                        <p className="text-slate-400">No reservations found.</p>
                        <p className="text-sm text-slate-500 mt-1">Reservations will appear here when guests book your properties.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {reservations.map((reservation) => (
                            <Link
                                key={reservation._id}
                                to={`/accommodation/reservations/${reservation._id}`}
                                className="block rounded-2xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-emerald-500 group"
                            >
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-white">{reservation.guestName || 'Guest'}</p>
                                                {reservation.source === 'booking' && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300">Online</span>
                                                )}
                                                {reservation.source === 'direct' && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300">Direct</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-400 mt-1">
                                                {reservation.property?.name || 'Property'} · Room {reservation.room?.roomNumber || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-white">KES {reservation.totalAmount?.toLocaleString() || '0'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(reservation.status || 'pending')}`}>
                                            {(reservation.status || 'pending').replace('_', ' ')}
                                        </span>
                                        {reservation.paymentStatus && (
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getPaymentColor(reservation.paymentStatus)}`}>
                                                {reservation.paymentStatus}
                                            </span>
                                        )}
                                        <span className="text-xs text-slate-500">
                                            {reservation.checkIn ? new Date(reservation.checkIn).toLocaleDateString() : '—'} → {reservation.checkOut ? new Date(reservation.checkOut).toLocaleDateString() : '—'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReservationsListPage;