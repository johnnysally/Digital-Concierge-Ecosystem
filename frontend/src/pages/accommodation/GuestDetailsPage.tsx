import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getGuest } from '../../api/accommodation/guestApi';

const GuestDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [guest, setGuest] = useState<any>(null);
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        const fetchGuest = async () => {
            try {
                const response = await getGuest(id);
                setGuest(response.guest);
                setReservations(response.reservations || []);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load guest information');
            } finally {
                setLoading(false);
            }
        };

        fetchGuest();
    }, [id]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Guest profile</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">{guest ? `${guest.firstName || ''} ${guest.lastName || ''}` : 'Guest details'}</h2>
                </div>
                <Link
                    to="/accommodation/guests"
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 transition hover:border-emerald-500 hover:text-white"
                >
                    Back to guests
                </Link>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Loading guest profile...</p>
                ) : guest ? (
                    <div className="space-y-6 text-sm text-slate-300">
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <p className="text-slate-400">Email</p>
                                <p className="mt-1 font-medium text-white">{guest.email || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-slate-400">Phone</p>
                                <p className="mt-1 font-medium text-white">{guest.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-slate-400">Bookings</p>
                                <p className="mt-1 font-medium text-white">{reservations.length}</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                            <p className="font-semibold text-white">Recent reservations</p>
                            {reservations.length === 0 ? (
                                <p className="mt-3 text-sm text-slate-400">No bookings found for this guest.</p>
                            ) : (
                                <div className="mt-4 space-y-3">
                                    {reservations.map((reservation) => (
                                        <Link
                                            key={reservation._id}
                                            to={`/accommodation/reservations/${reservation._id}`}
                                            className="block rounded-2xl border border-slate-800 bg-slate-900/90 p-4 transition hover:border-emerald-500"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="font-medium text-white">{reservation.property?.name || 'Property'}</p>
                                                    <p className="text-sm text-slate-400">Room {reservation.room?.roomNumber || 'N/A'}</p>
                                                </div>
                                                <span className="text-sm text-emerald-300">{reservation.status}</span>
                                            </div>
                                            <p className="mt-2 text-sm text-slate-400">{reservation.checkIn || '—'} to {reservation.checkOut || '—'}</p>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-slate-400">Guest not found.</p>
                )}
            </div>
        </div>
    );
};

export default GuestDetailsPage;
