import { useEffect, useState, type FormEvent } from 'react';
import { getMyProperties } from '../../api/accommodation/propertyApi';
import { getRooms } from '../../api/accommodation/roomApi';
import { getStaff } from '../../api/accommodation/staffApi';
import { createTask, deleteTask, getTasks } from '../../api/accommodation/housekeepingApi';

const HousekeepingListPage = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [properties, setProperties] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [form, setForm] = useState({
        property: '',
        room: '',
        taskType: 'cleaning',
        priority: 'medium',
        assignedTo: '',
        notes: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const fetchResources = async () => {
        try {
            const [propertyResponse, staffResponse, taskResponse] = await Promise.all([
                getMyProperties(),
                getStaff(),
                getTasks(),
            ]);
            setProperties(propertyResponse.properties || []);
            setStaff(staffResponse.staff || []);
            setTasks(taskResponse.tasks || []);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to load housekeeping data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    useEffect(() => {
        const loadRooms = async () => {
            if (!form.property) {
                setRooms([]);
                setForm((prev) => ({ ...prev, room: '' }));
                return;
            }

            try {
                const response = await getRooms({ propertyId: form.property });
                setRooms(response.rooms || []);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load rooms');
            }
        };

        loadRooms();
    }, [form.property]);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setSaving(true);
        setError('');
        setMessage('');

        try {
            await createTask({
                property: form.property,
                room: form.room,
                taskType: form.taskType,
                priority: form.priority,
                assignedTo: form.assignedTo || undefined,
                notes: form.notes,
            });
            setMessage('Housekeeping task created successfully.');
            setForm({ property: form.property, room: '', taskType: 'cleaning', priority: 'medium', assignedTo: '', notes: '' });
            const response = await getTasks();
            setTasks(response.tasks || []);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to create task');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            setLoading(true);
            await deleteTask(id);
            const response = await getTasks();
            setTasks(response.tasks || []);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to delete task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Housekeeping</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Organize cleaning and maintenance work</h2>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}
            {message ? <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">{message}</div> : null}

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                    <h3 className="text-lg font-semibold text-white">Create task</h3>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                        <div>
                            <label className="mb-2 block text-sm text-slate-300">Room</label>
                            <select
                                value={form.room}
                                onChange={(e) => setForm({ ...form, room: e.target.value })}
                                required
                                disabled={!rooms.length}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                            >
                                <option value="">Select room</option>
                                {rooms.map((room) => (
                                    <option key={room._id} value={room._id}>{room.roomNumber}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Task type</label>
                                <select
                                    value={form.taskType}
                                    onChange={(e) => setForm({ ...form, taskType: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                >
                                    <option value="cleaning">Cleaning</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="inspection">Inspection</option>
                                    <option value="turnover">Turnover</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Priority</label>
                                <select
                                    value={form.priority}
                                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm text-slate-300">Assigned to</label>
                            <select
                                value={form.assignedTo}
                                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                            >
                                <option value="">Anyone</option>
                                {staff.map((person) => (
                                    <option key={person._id} value={person._id}>{person.firstName} {person.lastName} ({person.role})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm text-slate-300">Notes</label>
                            <textarea
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                rows={4}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
                        >
                            {saving ? 'Creating...' : 'Create housekeeping task'}
                        </button>
                    </form>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                    <h3 className="text-lg font-semibold text-white">Recent housekeeping tasks</h3>
                    {loading ? (
                        <p className="mt-4 text-sm text-slate-400">Loading tasks...</p>
                    ) : tasks.length === 0 ? (
                        <p className="mt-4 text-sm text-slate-400">No housekeeping tasks found yet.</p>
                    ) : (
                        <div className="mt-4 space-y-3">
                            {tasks.map((task) => (
                                <div key={task._id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="font-medium text-white">{task.taskType}</p>
                                            <p className="text-sm text-slate-400">{task.property?.name || task.property || 'Property not set'} • Room {task.room?.roomNumber || 'TBD'}</p>
                                            <p className="text-sm text-slate-400">Assigned to {task.assignedTo ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}` : 'anyone'}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 text-sm text-slate-300">
                                            <span className="rounded-full bg-slate-800 px-2.5 py-1">{task.priority}</span>
                                            <span className={task.status === 'completed' ? 'text-emerald-300' : 'text-slate-300'}>{task.status}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(task._id)}
                                                className="rounded-full border border-rose-500 px-3 py-1 text-rose-300 transition hover:bg-rose-500/10"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    {task.notes ? <p className="mt-2 text-sm text-slate-400">{task.notes}</p> : null}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HousekeepingListPage;
