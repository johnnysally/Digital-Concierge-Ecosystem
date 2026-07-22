import { useEffect, useState, type FormEvent, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createRoom, getRoom, updateRoom, uploadRoomImages } from '../../api/accommodation/roomApi';
import { getMyProperties } from '../../api/accommodation/propertyApi';

const RoomFormPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [properties, setProperties] = useState<any[]>([]);
    const [form, setForm] = useState({
        property: '',
        roomNumber: '',
        type: 'single',
        price: '',
        currency: 'KES',
        capacity: 1,
        status: 'available',
        summary: '',
        description: '',
        amenities: '',
        floor: '',
    });
    const [photos, setPhotos] = useState<string[]>([]);
    const [loading, setLoading] = useState(Boolean(id));
    const [saving, setSaving] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const parseList = (value: string) => value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);

    const splitDescription = (value: string) => {
        const parts = value.split(/\n\s*\n/).filter(Boolean);
        return { summary: parts[0] || '', description: parts.slice(1).join('\n\n') };
    };

    const buildDescription = (summary: string, details: string) => [summary, details].filter(Boolean).join('\n\n');

    useEffect(() => {
        getMyProperties()
            .then((res) => setProperties(res.properties || []))
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!id) { setLoading(false); return; }
        getRoom(id).then((response) => {
            const room = response.room;
            const { summary, description } = splitDescription(room.description || '');
            setForm({
                property: room.property?._id || '',
                roomNumber: room.roomNumber || '',
                type: room.type || 'single',
                price: room.price?.toString() || '',
                currency: room.currency || 'KES',
                capacity: room.capacity || 1,
                status: room.status || 'available',
                summary,
                description,
                amenities: (room.amenities || []).join(', '),
                floor: room.floor?.toString() || '',
            });
            setPhotos(room.photos || []);
        }).catch((err: any) => setError(err?.response?.data?.message || 'Unable to load room'))
        .finally(() => setLoading(false));
    }, [id]);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        setUploadingImages(true);
        try {
            const res = await uploadRoomImages(files);
            const urls = res.images || [];
            if (urls.length > 0) {
                setPhotos((current) => [...current, ...urls]);
                setMessage(`${urls.length} image(s) uploaded successfully.`);
            } else {
                setError('Upload returned no images.');
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to upload images');
        } finally {
            setUploadingImages(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removePhoto = (index: number) => {
        setPhotos((current) => current.filter((_, i) => i !== index));
    };

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
                description: buildDescription(form.summary, form.description),
                photos,
                amenities: parseList(form.amenities),
                floor: form.floor ? Number(form.floor) : undefined,
            };
            if (id) {
                await updateRoom(id, payload);
                setMessage('Room updated successfully.');
            } else {
                await createRoom(payload);
                setMessage('Room created successfully.');
            }
            setTimeout(() => navigate('/accommodation/rooms'), 1000);
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

            {error && <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>}
            {message && <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">{message}</div>}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Loading room data...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm text-slate-300">Property</label>
                            <select value={form.property} onChange={(e) => setForm({ ...form, property: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                                <option value="">Select property</option>
                                {properties.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                            </select>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Room number</label>
                                <input value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} required
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Room type</label>
                                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                                    <option value="single">Single</option><option value="double">Double</option>
                                    <option value="suite">Suite</option><option value="family">Family</option>
                                    <option value="deluxe">Deluxe</option><option value="penthouse">Penthouse</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Price</label>
                                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} type="number" required
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Currency</label>
                                <input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Capacity</label>
                                <input value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} type="number" min={1}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Status</label>
                                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                                    <option value="available">Available</option><option value="occupied">Occupied</option>
                                    <option value="maintenance">Maintenance</option><option value="cleaning">Cleaning</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Floor</label>
                                <input value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} type="number" min={0} placeholder="e.g. 3"
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-slate-300">Short description</label>
                            <input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="A quick summary for the room"
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-slate-300">Full description</label>
                            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4}
                                placeholder="Add the room highlights, views, and extra details"
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none" />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Images ({photos.length})</label>
                                <input type="file" accept="image/*" multiple ref={fileInputRef} onChange={handleImageUpload}
                                    className="w-full rounded-2xl border border-dashed border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300" />
                                {uploadingImages && <p className="mt-2 text-sm text-emerald-400">Uploading to Cloudinary...</p>}

                                {photos.length > 0 && (
                                    <div className="mt-3 grid grid-cols-3 gap-2">
                                        {photos.map((url, i) => (
                                            <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-700">
                                                <img src={url} alt={`Room ${i + 1}`} className="w-full h-24 object-cover" />
                                                <button type="button" onClick={() => removePhoto(i)}
                                                    className="absolute top-1 right-1 bg-rose-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {photos.length === 0 && <p className="mt-2 text-xs text-slate-500">Upload images to display them here.</p>}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Amenities</label>
                                <textarea value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} rows={3}
                                    placeholder="Air conditioning, TV, Coffee maker"
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <button type="submit" disabled={saving}
                                className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60">
                                {saving ? 'Saving...' : id ? 'Update room' : 'Create room'}
                            </button>
                            <button type="button" onClick={() => navigate('/accommodation/rooms')}
                                className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm text-slate-200 transition hover:border-emerald-500 hover:text-white">
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