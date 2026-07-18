import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getRoom } from '../../api/accommodation/roomApi';

const RoomDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [room, setRoom] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        const fetchRoom = async () => {
            try {
                const response = await getRoom(id);
                setRoom(response.room);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load room details');
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [id]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Room details</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">{room?.roomNumber || 'Room details'}</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link
                        to="/accommodation/rooms"
                        className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 transition hover:border-emerald-500 hover:text-white"
                    >
                        Back to rooms
                    </Link>
                    {id ? (
                        <button
                            type="button"
                            onClick={() => navigate(`/accommodation/rooms/${id}/edit`)}
                            className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                        >
                            Edit room
                        </button>
                    ) : null}
                </div>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Loading room information...</p>
                ) : room ? (
                    <div className="space-y-4 text-sm text-slate-300">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-slate-400">Property</p>
                                <p className="mt-1 font-medium text-white">{room.property?.name || 'Unassigned'}</p>
                            </div>
                            <div>
                                <p className="text-slate-400">Type</p>
                                <p className="mt-1 font-medium text-white">{room.type || 'Unknown'}</p>
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <p className="text-slate-400">Status</p>
                                <p className="mt-1 font-medium text-white">{room.status || 'available'}</p>
                            </div>
                            <div>
                                <p className="text-slate-400">Capacity</p>
                                <p className="mt-1 font-medium text-white">{room.capacity || '1'} guests</p>
                            </div>
                            <div>
                                <p className="text-slate-400">Price</p>
                                <p className="mt-1 font-medium text-white">{room.price ? `KES ${room.price}` : 'N/A'}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-400">Description</p>
                            <p className="mt-1 text-slate-200">{room.description || 'No description available.'}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-slate-400">Room not found.</p>
                )}
            </div>
        </div>
    );
};

export default RoomDetailsPage;
