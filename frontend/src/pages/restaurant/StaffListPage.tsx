import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRestaurantStaff, setRestaurantStaff } from './mockData';

const StaffListPage = () => {
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setStaff(getRestaurantStaff());
        setLoading(false);
    }, []);

    const handleDelete = (id: string) => {
        const nextStaff = staff.filter((member) => member._id !== id);
        setStaff(nextStaff);
        setRestaurantStaff(nextStaff);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-[24px] border border-slate-800 bg-slate-950/70 p-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Staff</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Manage shift staff</h1>
                    <p className="mt-2 text-sm text-slate-400">Keep your team roster and active roles in sync with the restaurant backend.</p>
                </div>
                <Link to="/restaurant-admin/staff/new" className="rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950">Add staff</Link>
            </div>

            <div className="grid gap-4">
                {loading ? <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-400">Loading staff...</div> : staff.length ? staff.map((member) => (
                    <div key={member._id} className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-lg font-semibold text-white">{`${member.firstName || ''} ${member.lastName || ''}`.trim() || member.name || 'Staff member'}</p>
                                <p className="mt-1 text-sm text-slate-400">{member.role || 'Staff'} • {member.email || 'No email'} • {member.phone || 'No phone'}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${member.active !== false ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>
                                    {member.active !== false ? 'Active' : 'Inactive'}
                                </span>
                                <Link to={`/restaurant-admin/staff/${member._id}/edit`} className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">Edit</Link>
                                <button type="button" onClick={() => handleDelete(member._id)} className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">Delete</button>
                            </div>
                        </div>
                    </div>
                )) : <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-400">No staff assigned.</div>}
            </div>
        </div>
    );
};

export default StaffListPage;
