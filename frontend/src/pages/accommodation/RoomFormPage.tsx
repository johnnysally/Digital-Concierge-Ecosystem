import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createRoom, getRoom, updateRoom } from '../../api/accommodation/roomApi';
import { getMyProperties } from '../../api/accommodation/propertyApi';

const RoomFormPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [properties, setProperties] = useState<any[]>([]);
    const [form, setForm] = useState({
        property: '',
        roomNumber: '',
        type: 'single',
        price: '',
        currency: 'KES',
        capacity: 1,
        status: 'available',
        description: '',
    });
    const [loading, setLoading] = useState(Boolean(id));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const propertyResponse = await getMyProperties();
                setProperties(propertyResponse.properties || []);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load properties');
            }
        };

        fetchResources();
    }, []);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchRoom = async () => {
            try {
                const response = await getRoom(id);
                const room = response.room;
                setForm({
                    property: room.property?._id || '',
                    roomNumber: room.roomNumber || '',
                    type: room.type || 'single',
                    price: room.price?.toString() || '',
                    currency: room.currency || 'KES',
                    capacity: room.capacity || 1,
                    status: room.status || 'available',
                    description: room.description || '',
                });
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load room');
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [id]);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setSaving(true);
        setError('');
        setMessage('');

        try {
            const payload = {
                property: form.property,
                roomNumber: form.roomNumber,
                type: form.type,
                price: Number(form.price),
                currency: form.currency,
                capacity: Number(form.capacity),
                status: form.status,
                description: form.description,
            };

            if (id) {
                await updateRoom(id, payload);
                setMessage('Room updated successfully.');
            } else {
                const response = await createRoom(payload);
                setMessage('Room created successfully.');
                navigate(`/accommodation/rooms/${response.room._id}`);
                return;
            }

            setTimeout(() => navigate('/accommodation/rooms'), 700);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to save room');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Room</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{id ? 'Edit Room' : 'Add New Room'}</h2>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}
            {message ? <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">{message}</div> : null}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Loading room data...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm text-slate-300">Property</label>
                            <select
                                value={form.property}
                                onChange={(e) => setForm({ ...form, property: e.target.value })}
                                required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                            >
                                <option value="">Select property</option>
                                {properties.map((property) => (
                                    <option key={property._id} value={property._id}>{property.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Room number</label>
                                <input
                                    value={form.roomNumber}
                                    onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                                    required
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Room type</label>
                                <select
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    required
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                >
                                    <option value="single">Single</option>
                                    <option value="double">Double</option>
                                    <option value="suite">Suite</option>
                                    <option value="family">Family</option>
                                    <option value="deluxe">Deluxe</option>
                                    <option value="penthouse">Penthouse</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Price</label>
                                <input
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    type="number"
                                    required
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Currency</label>
                                <input
                                    value={form.currency}
                                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Capacity</label>
                                <input
                                    value={form.capacity}
                                    onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                                    type="number"
                                    min={1}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-slate-300">Status</label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                            >
                                <option value="available">Available</option>
                                <option value="occupied">Occupied</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="cleaning">Cleaning</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-slate-300">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={4}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
                            />
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
                            >
                                {saving ? 'Saving...' : id ? 'Update room' : 'Create room'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/accommodation/rooms')}
                                className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm text-slate-200 transition hover:border-emerald-500 hover:text-white"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RoomFormPage;
