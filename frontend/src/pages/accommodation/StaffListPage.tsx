import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteStaff, getStaff } from '../../api/accommodation/staffApi';

const StaffListPage = () => {
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadStaff = async () => {
        try {
            const response = await getStaff();
            setStaff(response.staff || []);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to load staff members');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStaff();
    }, []);

    const handleRemove = async (id: string) => {
        if (!window.confirm('Remove this staff member?')) return;
        try {
            setLoading(true);
            await deleteStaff(id);
            await loadStaff();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to remove staff');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Staff</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Manage your team</h2>
                </div>
                <Link
                    to="/accommodation/staff/new"
                    className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                    Add staff member
                </Link>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Loading staff...</p>
                ) : staff.length === 0 ? (
                    <p className="text-sm text-slate-400">No staff members yet. Add your first team member.</p>
                ) : (
                    <div className="space-y-3">
                        {staff.map((member) => (
                            <div key={member._id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="font-medium text-white">{member.firstName} {member.lastName}</p>
                                        <p className="text-sm text-slate-400">{member.role || 'Team member'}</p>
                                        <p className="text-sm text-slate-400">{member.email}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        <Link
                                            to={`/accommodation/staff/${member._id}`}
                                            className="rounded-full border border-slate-700 px-3 py-1 text-slate-200 transition hover:border-emerald-500 hover:text-white"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleRemove(member._id)}
                                            className="rounded-full border border-rose-500 px-3 py-1 text-rose-300 transition hover:bg-rose-500/10"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffListPage;
