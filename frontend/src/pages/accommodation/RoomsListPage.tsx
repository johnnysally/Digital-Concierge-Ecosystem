import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRooms } from '../../api/accommodation/roomApi';

interface RoomItem {
    _id: string;
    roomNumber?: string;
    type?: string;
    status?: string;
    price?: number;
    property?: { name?: string };
}

const RoomsListPage = () => {
    const [rooms, setRooms] = useState<RoomItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await getRooms({});
                setRooms(response.rooms || []);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load rooms');
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Rooms</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Manage inventory across your properties</h2>
                </div>
                <Link
                    to="/accommodation/rooms/new"
                    className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                    Add room
                </Link>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Loading rooms...</p>
                ) : rooms.length === 0 ? (
                    <p className="text-sm text-slate-400">No rooms found yet. Add a room to get started.</p>
                ) : (
                    <div className="space-y-3">
                        {rooms.map((room) => (
                            <Link
                                key={room._id}
                                to={`/accommodation/rooms/${room._id}`}
                                className="block rounded-2xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-emerald-500"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-medium text-white">{room.roomNumber || 'Room'}</p>
                                        <p className="text-sm text-slate-400">{room.type || 'Room type'} • {room.property?.name || 'Unassigned'}</p>
                                    </div>
                                    <div className="text-sm text-slate-300">{room.status || 'available'}</div>
                                </div>
                                <div className="mt-3 text-sm text-emerald-300">{room.price ? `KES ${room.price}` : 'Price unavailable'}</div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomsListPage;
