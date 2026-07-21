import React from 'react';

const MaintenancePage = () => {
    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Maintenance</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Vehicle maintenance</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-400">Track maintenance status, schedule checks, and manage vehicle service events.</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
                <p className="text-slate-400">Vehicle maintenance is not yet connected. This page will display fleet service tasks when the backend APIs are available.</p>
            </div>
        </div>
    );
};

export default MaintenancePage;
