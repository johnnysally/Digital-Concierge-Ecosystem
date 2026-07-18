import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getReservations } from '../../api/accommodation/reservationApi';

interface ReservationItem {
    _id: string;
    guestName?: string;
    status?: string;
    totalAmount?: number;
    checkIn?: string;
    checkOut?: string;
}

const ReservationsListPage = () => {
    const [reservations, setReservations] = useState<ReservationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await getReservations({ limit: 20 });
                setReservations(response.reservations || []);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load reservations');
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Reservations</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Track guest bookings and stay outcomes</h2>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Loading reservations...</p>
                ) : reservations.length === 0 ? (
                    <p className="text-sm text-slate-400">No reservations yet.</p>
                ) : (
                    <div className="space-y-3">
                        {reservations.map((reservation) => (
                            <Link
                                key={reservation._id}
                                to={`/accommodation/reservations/${reservation._id}`}
                                className="block rounded-2xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-emerald-500"
                            >
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="font-medium text-white">{reservation.guestName || 'Guest'}</p>
                                        <p className="text-sm text-slate-400">{reservation.checkIn || '—'} to {reservation.checkOut || '—'}</p>
                                    </div>
                                    <div className="text-sm text-slate-300">
                                        <div>Status: {reservation.status || 'Pending'}</div>
                                        <div className="text-emerald-300">Amount: {reservation.totalAmount ? `KES ${reservation.totalAmount}` : '—'}</div>
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
