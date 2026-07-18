import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGuests } from '../../api/accommodation/guestApi';

interface GuestItem {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
}

const GuestsListPage = () => {
    const [guests, setGuests] = useState<GuestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGuests = async () => {
            try {
                const response = await getGuests();
                setGuests(response.guests || []);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load guests');
            } finally {
                setLoading(false);
            }
        };

        fetchGuests();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Guests</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">View guest records and booking history</h2>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Loading guests...</p>
                ) : guests.length === 0 ? (
                    <p className="text-sm text-slate-400">No guest records found yet.</p>
                ) : (
                    <div className="space-y-3">
                        {guests.map((guest) => (
                            <Link
                                key={guest._id}
                                to={`/accommodation/guests/${guest._id}`}
                                className="block rounded-2xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-emerald-500"
                            >
                                <p className="font-medium text-white">{guest.firstName || 'Guest'} {guest.lastName || ''}</p>
                                <p className="text-sm text-slate-400">{guest.email || 'No email'} · {guest.phone || 'No phone'}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GuestsListPage;
